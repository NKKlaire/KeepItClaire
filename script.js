const allArticles = Array.isArray(window.__ARTICLES__) ? window.__ARTICLES__ : [];
const articles = allArticles.filter((article) => !article.hidden);
const pinnedArticles = allArticles
  .filter((article) => article.pinned)
  .sort((a, b) => (a.pinOrder ?? 999) - (b.pinOrder ?? 999));

const palettes = [
  { bg: "#dfff73", soft: "#ecff9a", ink: "#101010" },
  { bg: "#24aceb", soft: "#8be2ff", ink: "#101010" },
  { bg: "#31cc70", soft: "#8df0b7", ink: "#101010" },
  { bg: "#c1b2ff", soft: "#ded5ff", ink: "#101010" },
  { bg: "#ff8f4e", soft: "#ffc08f", ink: "#101010" },
  { bg: "#ff89be", soft: "#ffc2dd", ink: "#101010" },
  { bg: "#8ae5de", soft: "#c0fff7", ink: "#101010" },
  { bg: "#ffdd67", soft: "#fff0aa", ink: "#101010" },
];

const cardImages = [
  {
    src: "https://images.unsplash.com/photo-1771784970791-2032a255709d?auto=format&fit=crop&w=1200&q=80",
    position: "center 62%",
  },
  {
    src: "https://images.unsplash.com/photo-1641786257552-59f6606d3c0d?auto=format&fit=crop&w=1200&q=80",
    position: "center 58%",
  },
  {
    src: "https://images.unsplash.com/photo-1759247634280-2a9601467b72?auto=format&fit=crop&w=1200&q=80",
    position: "center 54%",
  },
  {
    src: "https://images.unsplash.com/photo-1757911261159-c3d020451341?auto=format&fit=crop&w=1200&q=80",
    position: "center 46%",
  },
  {
    src: "https://images.unsplash.com/photo-1741789597273-e3343e97f3c1?auto=format&fit=crop&w=1200&q=80",
    position: "center 48%",
  },
  {
    src: "https://images.unsplash.com/photo-1759053457114-2f5ce9a7729c?auto=format&fit=crop&w=1200&q=80",
    position: "center 56%",
  },
  {
    src: "https://images.unsplash.com/photo-1765871320362-5d24598e942d?auto=format&fit=crop&w=1200&q=80",
    position: "center 40%",
  },
];

const artProjects = [
  {
    title: "Digital Collages",
    subtitle: "拼贴、颗粒、手写感和那些不需要被解释得太清楚的图像。",
    label: "Collage",
    visual: "weave",
    paletteIndex: 5,
  },
  {
    title: "Poster Drafts",
    subtitle: "海报、排版、色块和故意保留手感的草稿。",
    label: "Poster",
    visual: "orbit",
    paletteIndex: 3,
  },
  {
    title: "Motion Sketches",
    subtitle: "会动的视觉练习、视频实验，以及先做出来再决定去向的灵感。",
    label: "Motion",
    visual: "arch",
    paletteIndex: 4,
  },
  {
    title: "Scribble Systems",
    subtitle: "关于结构、字体和自由笔触如何共存的练习。",
    label: "Process",
    visual: "petals",
    paletteIndex: 6,
  },
];

const momentImages = [
  {
    src: "https://images.unsplash.com/photo-1771784970791-2032a255709d?auto=format&fit=crop&w=900&q=80",
    title: "Quiet mountain weather",
  },
  {
    src: "https://images.unsplash.com/photo-1641786257552-59f6606d3c0d?auto=format&fit=crop&w=900&q=80",
    title: "Blue horizon walk",
  },
  {
    src: "https://images.unsplash.com/photo-1759247634280-2a9601467b72?auto=format&fit=crop&w=900&q=80",
    title: "Light after rain",
  },
  {
    src: "https://images.unsplash.com/photo-1757911261159-c3d020451341?auto=format&fit=crop&w=900&q=80",
    title: "Late sun on the road",
  },
  {
    src: "https://images.unsplash.com/photo-1741789597273-e3343e97f3c1?auto=format&fit=crop&w=900&q=80",
    title: "Wind over water",
  },
  {
    src: "https://images.unsplash.com/photo-1759053457114-2f5ce9a7729c?auto=format&fit=crop&w=900&q=80",
    title: "Field notes in motion",
  },
  {
    src: "https://images.unsplash.com/photo-1765871320362-5d24598e942d?auto=format&fit=crop&w=900&q=80",
    title: "Night drive fragments",
  },
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const seriesBlogCount = $("#series-blog-count");
const pinnedList = $("#pinned-articles");
const articleCount = $("#article-count");
const articleList = $("#article-list");
const archiveList = $("#archive-list");
const archiveOverlay = $("#archive");
const openArchiveButtons = $$("[data-open-archive]");
const closeArchiveButtons = $$("[data-close-archive]");
const tabButtons = $$(".tab-button");
const navTriggers = $$("[data-nav-trigger]");
const navIndexOverlay = $("#nav-index");
const navIndexPreview = $("#nav-index-preview");
const navIndexColumns = $("#nav-index-columns");
const closeNavButtons = $$("[data-close-nav]");
const cursorGlow = $("#cursor-glow");
const wandCursor = $("#wand-cursor");
const portalBurst = $("#portal-burst");
const quoteCards = $$("[data-quote-card]");
const shuffleQuotesButton = $("#shuffle-quotes");
const artStage = $("#art-stage");
const artThumbs = $("#art-thumbs");
const artRiverStrip = $("#art-river-strip");
const artPrev = $("#art-prev");
const artNext = $("#art-next");
const momentColumns = $$(".river-column");
const aliasDraggables = $$("[data-alias-draggable]");
const parallaxNodes = $$("[data-parallax]");
const revealItems = $$(".reveal");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isArtGalleryPage = document.body.dataset.page === "art";
const portalColors = {
  home: "#ffdd67",
  blog: "#dfff73",
  art: "#ff89be",
  media: "#8ae5de",
  about: "#c1b2ff",
  archive: "#ff8f4e",
};

let openNavKey = null;
let activeArtIndex = 0;

if (isArtGalleryPage && motionAllowed) {
  document.body.classList.add("show-wand");
}

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const escapeAttribute = (value) => escapeHtml(value).replace(/"/g, "&quot;");
const getPalette = (index) => palettes[index % palettes.length];
const getCardImage = (index) => cardImages[index % cardImages.length];
const articleHref = (id) => `./article.html?id=${encodeURIComponent(id)}`;
const formatIndex = (index) => String(index + 1).padStart(2, "0");

const isResearch = (article) =>
  article.tags.some((tag) =>
    ["Research", "Paper Notes", "Prompt Engineering", "LLM", "LLM Engineering", "Reward Models"].includes(tag)
  );

const isProduct = (article) =>
  article.tags.some((tag) =>
    ["AI Product", "Product", "Tool Review", "Workflows", "Guide", "Infra"].includes(tag)
  );

const isNotes = (article) =>
  article.tags.some((tag) =>
    ["Human Notes", "Notes", "Weekly Notes", "Personality", "Market Notes", "Case Study"].includes(tag)
  );

const filterMap = {
  all: () => true,
  research: isResearch,
  product: isProduct,
  notes: isNotes,
};

const renderTagPills = (tags) =>
  tags.map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("");

const renderPinnedArticles = () => {
  if (!pinnedList) {
    return;
  }

  if (!pinnedArticles.length) {
    pinnedList.hidden = true;
    return;
  }

  const colors = ["lime", "blue", "violet"];
  pinnedList.innerHTML = pinnedArticles
    .map(
      (article, index) => `
        <a class="pinned-card ${colors[index % colors.length]}" href="${articleHref(article.id)}" data-gallery-card>
          <span class="mini-label">Pinned ${formatIndex(index)}</span>
          <h1>${escapeHtml(article.title)}</h1>
        </a>
      `
    )
    .join("");
};

const getTimelineDate = (article) => {
  if (article.dateStatus === "needs-confirmation" || article.date === "待确认") {
    return {
      year: "待确认",
      day: "日期",
      full: "日期待确认",
    };
  }

  const match = String(article.date || "").match(/^(\d{4})\.(\d{2})\.(\d{2})$/);

  if (!match) {
    return {
      year: "Archive",
      day: "import",
      full: article.date || "Archive import",
    };
  }

  const [, year, month, day] = match;
  const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en", { month: "short" });

  return {
    year,
    day: `${monthName} ${Number(day)}`,
    full: `${year}.${month}.${day}`,
  };
};

const setArchiveOpen = (isOpen) => {
  if (!archiveOverlay) {
    return;
  }

  archiveOverlay.hidden = !isOpen;
  document.body.style.overflow = isOpen ? "hidden" : "";
};

const triggerPortalPulse = (event, color = "#dfff73") => {
  if (!portalBurst || !event || !motionAllowed) {
    return;
  }

  portalBurst.classList.remove("active");
  portalBurst.style.setProperty("--portal-x", `${event.clientX}px`);
  portalBurst.style.setProperty("--portal-y", `${event.clientY}px`);
  portalBurst.style.setProperty("--portal-color", color);
  void portalBurst.offsetWidth;
  portalBurst.classList.add("active");
};

const setLocalPointer = (event, node) => {
  const rect = node.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const dx = x - 50;
  const dy = y - 50;
  node.style.setProperty("--local-x", `${x}%`);
  node.style.setProperty("--local-y", `${y}%`);
  node.style.setProperty("--card-x", `${x}%`);
  node.style.setProperty("--card-y", `${y}%`);
  node.style.setProperty("--field-x", `${x}%`);
  node.style.setProperty("--field-y", `${y}%`);
  node.style.setProperty("--nudge-x", `${dx * 0.055}px`);
  node.style.setProperty("--nudge-y", `${dy * 0.055}px`);
  node.style.setProperty("--tilt-rotate", `${dx * 0.018}deg`);
};

const renderArticleRow = (article, index) => {
  const palette = getPalette(index);
  const image = getCardImage(index);
  const tagMarkup = renderTagPills(article.tags.slice(0, 3));
  const titleOnly = articleList?.dataset.display === "titles" || document.body.dataset.page === "blog";

  if (titleOnly) {
    const timelineDate = getTimelineDate(article);

    return `
      <a
        class="blog-title-row gallery-card"
        href="${articleHref(article.id)}"
        data-gallery-card
        style="--card-bg:${palette.bg}; --card-soft:${palette.soft}; --card-ink:${palette.ink};"
      >
        <time class="timeline-date" datetime="${escapeAttribute(article.date)}">
          <span>${escapeHtml(timelineDate.year)}</span>
          <strong>${escapeHtml(timelineDate.day)}</strong>
        </time>
        <div class="blog-title-main">
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary || article.excerpt || "点击进入这篇文章。")}</p>
          <div class="article-card-meta">${tagMarkup}</div>
        </div>
      </a>
    `;
  }

  return `
    <a
      class="article-row gallery-card"
      href="${articleHref(article.id)}"
      data-gallery-card
      style="--card-bg:${palette.bg}; --card-soft:${palette.soft}; --card-ink:${palette.ink};"
    >
      <span class="article-row-index">${formatIndex(index)}</span>
      <div class="article-row-main">
        <div class="article-row-kicker">
          <span>${escapeHtml(article.date)}</span>
          <span>${escapeHtml(article.location)}</span>
        </div>
        <h3>${escapeHtml(article.title)}</h3>
        <p>${escapeHtml(article.summary)}</p>
        <div class="article-card-meta">${tagMarkup}</div>
      </div>
      <div class="article-row-media">
        <img
          src="${image.src}"
          alt="${escapeAttribute(article.title)} preview landscape"
          loading="${index < 4 ? "eager" : "lazy"}"
          decoding="async"
          style="object-position:${image.position};"
        />
      </div>
    </a>
  `;
};

const renderArticleFlow = (articleItems) => {
  if (!articleList || !articleCount) {
    return;
  }

  articleCount.textContent = String(articleItems.length);

  if (!articleItems.length) {
    articleList.innerHTML = `
      <article class="article-empty">
        <p class="eyebrow">No matches</p>
        <h3>这个分组里暂时还没有文章。</h3>
        <p>我们可以继续写，它会很快被填满。</p>
      </article>
    `;
    return;
  }

  articleList.innerHTML = articleItems.map((article) => renderArticleRow(article, articles.indexOf(article))).join("");
};

const renderArchive = (articleItems) => {
  if (!archiveList) {
    return;
  }

  archiveList.innerHTML = articleItems
    .map(
      (article, index) => `
        <a class="archive-item" href="${articleHref(article.id)}">
          <span class="card-index">${formatIndex(index)}</span>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.date)} · ${escapeHtml(article.location)}</p>
        </a>
      `
    )
    .join("");
};

const setFilter = (filterKey) => {
  const predicate = filterMap[filterKey] || filterMap.all;
  const filtered = articles.filter(predicate);
  renderArticleFlow(filtered);
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filterKey);
  });
};

const renderArtVisual = (visual) => {
  const pieces = Array.from({ length: 4 }, (_, index) => `<span class="art-shape piece-${index + 1}"></span>`).join("");
  return `<div class="art-visual ${visual}">${pieces}</div>`;
};

const renderArtStage = (index) => {
  if (!artStage || !artThumbs) {
    return;
  }

  activeArtIndex = (index + artProjects.length) % artProjects.length;
  const project = artProjects[activeArtIndex];
  const palette = getPalette(project.paletteIndex);

  artStage.style.setProperty("--card-bg", palette.bg);
  artStage.style.setProperty("--card-soft", palette.soft);
  artStage.innerHTML = `
    <div class="art-stage-copy">
      <span class="mini-label">${escapeHtml(project.label)}</span>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.subtitle)}</p>
    </div>
    ${renderArtVisual(project.visual)}
  `;
  artStage.dataset.artHref = `./art-piece.html?id=${activeArtIndex}`;
  artStage.setAttribute("tabindex", "0");
  artStage.setAttribute("role", "link");
  artStage.setAttribute("aria-label", `查看作品 ${project.title}`);

  artThumbs.innerHTML = artProjects
    .map(
      (item, itemIndex) => `
        <button class="${itemIndex === activeArtIndex ? "active" : ""}" type="button" data-art-thumb="${itemIndex}">
          <span>${formatIndex(itemIndex)}</span>
          ${escapeHtml(item.label)}
        </button>
      `
    )
    .join("");
};

const renderArtRiver = () => {
  if (!artRiverStrip) {
    return;
  }

  const cards = artProjects
    .map((project, index) => {
      const palette = getPalette(project.paletteIndex + index);
      return `
        <article class="art-river-card" style="--card-bg:${palette.bg};">
          <span>${escapeHtml(project.label)}</span>
          ${renderArtVisual(project.visual)}
          <a href="./art-piece.html?id=${index}">${escapeHtml(project.title)}</a>
        </article>
      `;
    })
    .join("");

  artRiverStrip.innerHTML = `${cards}${cards}`;
};

const renderMomentsRiver = () => {
  if (!momentColumns.length) {
    return;
  }

  const columns = [
    momentImages.slice(0, 5),
    [...momentImages.slice(2), ...momentImages.slice(0, 2)],
    [...momentImages.slice(1, 6)],
  ];

  momentColumns.forEach((column, columnIndex) => {
    const items = columns[columnIndex % columns.length];
    const cards = items
      .map(
        (item, index) => `
          <article class="moment-frame color-${(columnIndex + index) % palettes.length}">
            <img src="${item.src}" alt="${escapeAttribute(item.title)}" loading="lazy" decoding="async" />
            <span class="moment-tag">${escapeHtml(item.title)}</span>
          </article>
        `
      )
      .join("");

    column.innerHTML = `<div class="river-column-inner">${cards}${cards}</div>`;
  });
};

const renderNavPreviewCard = (config) => `
  <div class="nav-preview-card ${config.className || ""}" style="${config.style || ""}">
    <p class="nav-preview-eyebrow">${escapeHtml(config.eyebrow)}</p>
    <h3>${escapeHtml(config.title)}</h3>
    <p>${escapeHtml(config.copy)}</p>
    ${config.media || ""}
  </div>
`;

const renderNavColumns = (columns) =>
  columns
    .map(
      (column) => `
        <div class="nav-index-column">
          <span class="nav-index-label">${escapeHtml(column.label)}</span>
          ${column.links
            .map(
              (link) => `
                <a class="nav-index-link" href="${link.href}">
                  <span>${escapeHtml(link.title)}</span>
                  ${link.note ? `<small>${escapeHtml(link.note)}</small>` : ""}
                </a>
              `
            )
            .join("")}
        </div>
      `
    )
    .join("");

const getNavPanels = () => {
  const firstArticle = articles[0] || {
    id: "keep-it-claire",
    title: "Keep it Claire",
    summary: "This is where the writing starts.",
  };
  const recentArticles = articles.slice(0, 5);

  return {
    home: {
      preview: renderNavPreviewCard({
        className: "home-preview",
        eyebrow: "Home",
        title: "The front door of Keep it Claire.",
        copy: "首页先呈现 Claire 的思想底色，再把 Blog、Art、About 三个承接页清楚放出来。",
        media: `<div class="nav-preview-quote">Keep it Claire</div>`,
      }),
      columns: [
        {
          label: "Site map",
          links: [
            { href: "#about", title: "Home", note: "Intro and philosophy" },
            { href: "./blog.html", title: "Blog", note: `${articles.length} pieces` },
            { href: "./art.html", title: "Art", note: "Paintings and visual experiments" },
            { href: "./about.html", title: "About", note: "Social accounts and links" },
          ],
        },
        {
          label: "Mood",
          links: [
            { href: "#about", title: "Bold builders", note: "Build first" },
            { href: "#about", title: "Soft futures", note: "Keep the human warmth" },
            { href: "#about", title: "Keep it Claire", note: "Personal philosophy" },
          ],
        },
      ],
    },
    blog: {
      preview: renderNavPreviewCard({
        className: "blog-preview",
        eyebrow: "Shortcut: Blog",
        title: firstArticle.title,
        copy: firstArticle.summary,
        media: `
          <div class="nav-preview-photo">
            <img src="${getCardImage(0).src}" alt="${escapeAttribute(firstArticle.title)} cover" loading="lazy" decoding="async" />
          </div>
        `,
      }),
      columns: [
        {
          label: "Read next",
          links: recentArticles.map((article) => ({
            href: articleHref(article.id),
            title: article.title,
            note: article.tags[0] || "Blog",
          })),
        },
        {
          label: "Browse by mood",
          links: [
            { href: "./blog.html", title: "全部文章", note: "Reading order" },
            { href: "./blog.html", title: "研究 / 产品 / 随笔", note: "Switch tags" },
            { href: "./blog.html", title: "金句导览", note: "Stack shuffle" },
          ],
        },
      ],
    },
    art: {
      preview: renderNavPreviewCard({
        className: "arts-preview",
        eyebrow: "Gallery",
        title: "Color, typography, collage, and unfinished experiments.",
        copy: "作品落地页更像展厅，中间看作品，左右切换，下方保留作品说明。",
        media: `<div class="nav-preview-graphic orbit"><span></span><span></span><span></span><span></span></div>`,
      }),
      columns: [
        {
          label: "Making",
          links: [
            { href: "./art.html", title: "Paintings", note: "Color and feeling" },
            { href: "./art.html", title: "Digital collages", note: "Texture and image" },
            { href: "./art.html", title: "Visual experiments", note: "Type and rhythm" },
          ],
        },
        {
          label: "Intent",
          links: [
            { href: "./art.html", title: "照片或绘画的川流感", note: "Immersive gallery" },
            { href: "#about", title: "Human trace", note: "Anti-perfect" },
            { href: "#about", title: "Back to philosophy", note: "Why this matters" },
          ],
        },
      ],
    },
    media: {
      preview: renderNavPreviewCard({
        className: "media-preview",
        eyebrow: "About",
        title: "社媒账号、内容数据和找到我的入口。",
        copy: "About 统一承接小红书、公众号、即刻、微信和邮箱，让用户快速判断影响力并跳转联系。",
        media: `
          <div class="nav-preview-metrics">
            <span><strong>--</strong> 粉丝</span>
            <span><strong>--</strong> 笔记</span>
            <span><strong>--</strong> 爆款</span>
          </div>
        `,
      }),
      columns: [
        {
          label: "Profiles",
          links: [
            { href: "./profiles/profile.html?id=earth", title: "克莱尔在地球🌏", note: "Xiaohongshu preview" },
            { href: "./profiles/profile.html?id=rainy-apple", title: "雨天小苹果🍎", note: "Art account" },
            { href: "./about.html", title: "联系方式", note: "Email / WeChat / Jike" },
          ],
        },
        {
          label: "Data",
          links: [
            { href: "./about.html", title: "粉丝数", note: "Follower count" },
            { href: "./about.html", title: "爆款笔记", note: "Top notes" },
            { href: "./about.html", title: "账号链接", note: "Profile links" },
          ],
        },
      ],
    },
    about: {
      preview: renderNavPreviewCard({
        className: "about-preview",
        eyebrow: "Home",
        title: "Start from the front door.",
        copy: "这里是网站的第一层：我是谁、为什么写、为什么把 AI、产品、艺术和社媒入口放在同一个空间里。",
        media: `<div class="nav-preview-quote">Home</div>`,
      }),
      columns: [
        {
          label: "Beliefs",
          links: [
            { href: "#about", title: "Bold builders", note: "Build the world" },
            { href: "#about", title: "Soft futures", note: "Keep the warmth" },
            { href: "#about", title: "Make room", note: "Leave things open" },
          ],
        },
        {
          label: "Go next",
          links: [
            { href: "./blog.html", title: "Blog", note: "Writing archive" },
            { href: "./art.html", title: "Art", note: "Paintings and visuals" },
            { href: "./about.html", title: "About", note: "Find me" },
          ],
        },
      ],
    },
  };
};

const setNavPanel = (key) => {
  if (!navIndexOverlay || !navIndexPreview || !navIndexColumns) {
    return;
  }

  openNavKey = key;
  navIndexOverlay.hidden = !key;

  navTriggers.forEach((trigger) => {
    trigger.classList.toggle("active", trigger.dataset.navTrigger === key);
  });

  if (!key) {
    return;
  }

  const panel = getNavPanels()[key];
  if (!panel) {
    navIndexOverlay.hidden = true;
    return;
  }

  navIndexPreview.innerHTML = panel.preview;
  navIndexColumns.innerHTML = renderNavColumns(panel.columns);
};

const animateRouteTags = (node) => {
  const tags = [...node.querySelectorAll("[data-route-tag]")];
  tags.forEach((tag, index) => {
    tag.classList.remove("tag-jump");
    window.setTimeout(() => {
      tag.classList.add("tag-jump");
    }, index * 42);
  });
};

const rotateQuotes = (targetIndex) => {
  if (!quoteCards.length) {
    return;
  }

  const currentIndex = quoteCards.findIndex((card) => card.classList.contains("active"));
  const nextIndex = typeof targetIndex === "number" ? targetIndex : (currentIndex + 1) % quoteCards.length;

  quoteCards.forEach((card, index) => {
    const offset = (index - nextIndex + quoteCards.length) % quoteCards.length;
    card.classList.toggle("active", index === nextIndex);
    card.style.setProperty("--stack-offset", String(offset));
    card.style.setProperty("--stack-x", `${offset * 0.8}rem`);
    card.style.setProperty("--stack-y", `${offset * 1.2}rem`);
    card.style.setProperty("--stack-rotate", `${offset * 1.2}deg`);
    card.style.setProperty("--stack-scale", String(1 - offset * 0.045));
    card.style.setProperty("--stack-opacity", String(1 - offset * 0.22));
    card.style.setProperty("--stack-z", String(10 - offset));
  });
};

const setAliasPosition = (node, x, y, spin) => {
  node.dataset.dx = String(x);
  node.dataset.dy = String(y);
  node.dataset.spin = String(spin);
  node.style.setProperty("--dx", `${x}px`);
  node.style.setProperty("--dy", `${y}px`);
  node.style.setProperty("--spin", `${spin}deg`);
};

const initializeAliasDragging = () => {
  aliasDraggables.forEach((node) => {
    const handle = node.querySelector("[data-alias-handle]") || node;
    let startX = 0;
    let startY = 0;
    let baseX = 0;
    let baseY = 0;
    let spin = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let velocityX = 0;
    let velocityY = 0;
    let flingFrame = 0;

    const cancelFling = () => {
      if (flingFrame) {
        window.cancelAnimationFrame(flingFrame);
        flingFrame = 0;
      }
      node.classList.remove("flinging");
    };

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      cancelFling();
      startX = event.clientX;
      startY = event.clientY;
      baseX = Number(node.dataset.dx || 0);
      baseY = Number(node.dataset.dy || 0);
      spin = Number(node.dataset.spin || 0);
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = event.timeStamp || performance.now();
      velocityX = 0;
      velocityY = 0;
      node.classList.add("dragging");
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove", (event) => {
      if (!node.classList.contains("dragging")) {
        return;
      }

      const nextX = baseX + event.clientX - startX;
      const nextY = baseY + event.clientY - startY;
      const now = event.timeStamp || performance.now();
      const delta = Math.max(now - lastTime, 16);
      velocityX = ((event.clientX - lastX) / delta) * 16;
      velocityY = ((event.clientY - lastY) / delta) * 16;
      spin += velocityX * 0.08;
      setAliasPosition(node, nextX, nextY, spin);
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;
    });

    const endDrag = (event) => {
      if (!node.classList.contains("dragging")) {
        return;
      }

      node.classList.remove("dragging");

      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }

      let x = Number(node.dataset.dx || 0);
      let y = Number(node.dataset.dy || 0);
      let localSpin = Number(node.dataset.spin || 0);
      let vx = velocityX * 1.35;
      let vy = velocityY * 1.35;
      node.classList.add("flinging");

      const step = () => {
        x += vx;
        y += vy;
        localSpin += vx * 0.06;
        vx *= 0.9;
        vy *= 0.9;
        setAliasPosition(node, x, y, localSpin);

        if (Math.abs(vx) + Math.abs(vy) > 0.52 && motionAllowed) {
          flingFrame = window.requestAnimationFrame(step);
          return;
        }

        flingFrame = 0;
        window.setTimeout(() => node.classList.remove("flinging"), 260);
      };

      if (motionAllowed) {
        flingFrame = window.requestAnimationFrame(step);
      } else {
        node.classList.remove("flinging");
      }
    };

    handle.addEventListener("pointerup", endDrag);
    handle.addEventListener("pointercancel", endDrag);
  });
};

if (seriesBlogCount) {
  seriesBlogCount.textContent = `${articles.length} pieces`;
}

renderArchive(articles);
renderPinnedArticles();
setFilter("all");
renderArtStage(0);
renderArtRiver();
renderMomentsRiver();
rotateQuotes(0);
initializeAliasDragging();

openArchiveButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    setNavPanel(null);
    triggerPortalPulse(event, portalColors.archive);
    setArchiveOpen(true);
  });
});

closeArchiveButtons.forEach((button) => {
  button.addEventListener("click", () => setArchiveOpen(false));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors.blog);
    setFilter(button.dataset.filter);
  });
});

navTriggers.forEach((trigger) => {
  const key = trigger.dataset.navTrigger;

  trigger.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors[key] || portalColors.home);
    setNavPanel(openNavKey === key ? null : key);
  });
});

closeNavButtons.forEach((button) => {
  button.addEventListener("click", () => setNavPanel(null));
});

if (navIndexOverlay) {
  navIndexOverlay.addEventListener("click", (event) => {
    if (
      event.target.closest(".nav-index-link") ||
      event.target.closest("[data-close-nav]") ||
      event.target.closest(".nav-index-backdrop")
    ) {
      setNavPanel(null);
    }
  });
}

if (shuffleQuotesButton) {
  shuffleQuotesButton.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors.blog);
    rotateQuotes();
  });
}

quoteCards.forEach((card, index) => {
  card.addEventListener("mouseenter", () => rotateQuotes(index));
});

if (artPrev) {
  artPrev.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors.art);
    renderArtStage(activeArtIndex - 1);
  });
}

if (artNext) {
  artNext.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors.art);
    renderArtStage(activeArtIndex + 1);
  });
}

if (artThumbs) {
  artThumbs.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-art-thumb]");
    if (!thumb) {
      return;
    }

    triggerPortalPulse(event, portalColors.art);
    renderArtStage(Number(thumb.dataset.artThumb));
  });
}

if (artStage) {
  artStage.addEventListener("click", (event) => {
    triggerPortalPulse(event, portalColors.art);
    window.setTimeout(() => {
      window.location.href = artStage.dataset.artHref || "./art-piece.html?id=0";
    }, 180);
  });

  artStage.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    window.location.href = artStage.dataset.artHref || "./art-piece.html?id=0";
  });
}

document.addEventListener("pointermove", (event) => {
  const fieldTarget = event.target.closest("[data-cursor-field]");
  const pointerTarget = event.target.closest("[data-gallery-card], .magic-button, .route-card, .builder-note, .flow-card");

  if (fieldTarget) {
    setLocalPointer(event, fieldTarget);
  }

  if (pointerTarget) {
    setLocalPointer(event, pointerTarget);
  }

  if (!motionAllowed) {
    return;
  }

  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;
  document.body.classList.add("has-pointer");
  document.body.classList.toggle("show-wand", isArtGalleryPage);
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

  if (wandCursor) {
    wandCursor.style.transform = `translate3d(${event.clientX + 14}px, ${event.clientY + 12}px, 0) rotate(-18deg)`;
  }

  parallaxNodes.forEach((node) => {
    const depth = Number(node.dataset.parallax || 0);
    node.style.transform = `translate3d(${x * 70 * depth}px, ${y * 70 * depth}px, 0)`;
  });
});

document.addEventListener("click", (event) => {
  if (
    openNavKey &&
    !event.target.closest(".nav-index-panel") &&
    !event.target.closest("[data-nav-trigger]")
  ) {
    setNavPanel(null);
  }

  const routeCard = event.target.closest("[data-route-card]");

  if (routeCard && routeCard.getAttribute("href")) {
    event.preventDefault();
    const color = routeCard.dataset.portalColor || portalColors.home;
    routeCard.classList.remove("card-bounce");
    void routeCard.offsetWidth;
    routeCard.classList.add("card-bounce");
    animateRouteTags(routeCard);
    triggerPortalPulse(event, color);

    window.setTimeout(() => {
      window.location.href = routeCard.href;
    }, 230);
    return;
  }

  const card = event.target.closest("[data-gallery-card]");

  if (!card || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  card.classList.remove("card-bounce");
  void card.offsetWidth;
  card.classList.add("card-bounce");
  triggerPortalPulse(event, card.style.getPropertyValue("--card-bg") || portalColors.blog);

  window.setTimeout(() => {
    window.location.href = card.href;
  }, 230);
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (archiveOverlay && !archiveOverlay.hidden) {
    setArchiveOpen(false);
  }

  if (navIndexOverlay && !navIndexOverlay.hidden) {
    setNavPanel(null);
  }
});

if (motionAllowed && revealItems.length) {
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
    { threshold: 0.12 }
  );

  revealItems.forEach((item, index) => {
    item.style.transition = `opacity 700ms ease ${index * 40}ms, transform 700ms ease ${index * 40}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.style.opacity = "1";
    item.style.transform = "translateY(0)";
  });
}

const routeSections = ["about", "blog", "art", "media"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (routeSections.length) {
  const routeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navTriggers.forEach((trigger) => {
        trigger.classList.toggle("current", trigger.dataset.navTrigger === visible.target.id);
      });
    },
    {
      rootMargin: "-38% 0px -52% 0px",
      threshold: [0.18, 0.28, 0.42],
    }
  );

  routeSections.forEach((section) => routeObserver.observe(section));
}
