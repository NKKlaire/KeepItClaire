const articles = Array.isArray(window.__ARTICLES__) ? window.__ARTICLES__ : [];
const articleHtml = window.__ARTICLE_HTML__ || {};
const articleBodies = window.__ARTICLE_BODIES__ || {};

const params = new URLSearchParams(window.location.search);
const requestedArticleId = params.get("id");
const missingArticle = {
  id: requestedArticleId || "missing-article",
  title: "Article needs review",
  summary: "这篇文章暂时没有成功导入正文，请检查源 HTML 文件。",
  excerpt: "正文导入缺失时，这里会显示源文件信息，而不是空白页。",
  date: "Claire Archive",
  tags: ["Import check"],
};
const article = requestedArticleId
  ? articles.find((item) => item.id === requestedArticleId) || missingArticle
  : articles[0] || missingArticle;

const kickerNode = document.getElementById("article-kicker");
const titleNode = document.getElementById("article-title");
const sideTitleNode = document.getElementById("article-side-title");
const articleMetaNode = document.getElementById("article-meta");
const contentNode = document.getElementById("article-content");
const tocNode = document.getElementById("article-toc");
const parallaxNodes = document.querySelectorAll("[data-parallax]");
const revealItems = document.querySelectorAll(".reveal");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const stripHtmlText = (value) =>
  String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const chunkParagraphs = (paragraphs) => {
  if (paragraphs.length >= 9) {
    return [
      { id: "read-me", title: "read me", paragraphs: paragraphs.slice(0, 3) },
      { id: "body", title: "正文", paragraphs: paragraphs.slice(3, 8) },
      { id: "read-more", title: "read more", paragraphs: paragraphs.slice(8, 12) },
    ];
  }

  return [
    { id: "read-me", title: "read me", paragraphs: [article.summary] },
    { id: "body", title: "正文", paragraphs: [article.excerpt || article.summary] },
  ];
};

const renderContent = (sections) => {
  contentNode.innerHTML = sections
    .map(
      (section) => `
        <section class="article-section" id="${escapeHtml(section.id)}">
          <h2>${escapeHtml(section.title)}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>
      `
    )
    .join("");
};

const renderMissingContent = () => {
  const source = article.sourceFile || requestedArticleId || article.id || "unknown source";
  contentNode.innerHTML = `
    <section class="article-section" id="import-check">
      <h2>Content needs review</h2>
      <p>这篇文章没有读取到可展示的正文，所以这里显示导入检查提示，避免阅读页空白。</p>
      <p>Source: ${escapeHtml(source)}</p>
      <p>这篇文章暂时没有可展示的正文。你可以先返回 Blog，稍后再来阅读。</p>
    </section>
  `;
};

const renderToc = () => {
  const sections = [...contentNode.querySelectorAll(".article-section")];
  tocNode.innerHTML = sections
    .map((section, index) => {
      const title = section.querySelector("h2")?.textContent.trim() || `Section ${index + 1}`;
      return `<a href="#${section.id}" data-section-link="${section.id}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(title)}</a>`;
    })
    .join("");

  return {
    sectionNodes: sections,
    tocLinks: [...tocNode.querySelectorAll("[data-section-link]")],
  };
};

const activateToc = ({ sectionNodes, tocLinks }) => {
  const setActiveSection = (id) => {
    tocLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.sectionLink === id);
    });
  };

  if (!sectionNodes.length) {
    return;
  }

  setActiveSection(sectionNodes[0].id);

  const tocObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);

      if (!visibleEntries.length) {
        return;
      }

      visibleEntries.sort((first, second) => second.intersectionRatio - first.intersectionRatio);
      setActiveSection(visibleEntries[0].target.id);
    },
    {
      rootMargin: "-15% 0px -55% 0px",
      threshold: [0.2, 0.45, 0.7],
    }
  );

  sectionNodes.forEach((node) => tocObserver.observe(node));
};

if (article) {
  const tags = Array.isArray(article.tags) ? article.tags : [];
  document.title = `${article.title} | Keep it Claire`;
  kickerNode.textContent = tags[0] || "Read me";
  titleNode.textContent = article.title;
  sideTitleNode.textContent = article.title;
  if (articleMetaNode) {
    articleMetaNode.innerHTML = `
      <span>${escapeHtml(article.date || "Claire Archive")}</span>
      ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
    `;
  }

  const importedHtml = articleHtml[article.id] || "";
  if (stripHtmlText(importedHtml).length > 0) {
    contentNode.innerHTML = importedHtml;
  } else {
    const paragraphs = Array.isArray(articleBodies[article.id]) ? articleBodies[article.id] : [];
    if (paragraphs.join("").trim().length > 0) {
      const sections = chunkParagraphs(paragraphs);
      renderContent(sections);
    } else {
      renderMissingContent();
    }
  }

  activateToc(renderToc());
}

if (motionAllowed) {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    parallaxNodes.forEach((node) => {
      const depth = Number(node.dataset.parallax || 0);
      node.style.transform = `translate3d(${x * 70 * depth}px, ${y * 70 * depth}px, 0)`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item, index) => {
    item.style.transition = `opacity 700ms ease ${index * 45}ms, transform 700ms ease ${index * 45}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.style.opacity = "1";
    item.style.transform = "translateY(0)";
  });
}
