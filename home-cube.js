const SCENES = Array.isArray(window.__HOME_CUBE_SCENES__) ? window.__HOME_CUBE_SCENES__.slice(0, 6) : [];
const COPY_KEY = "keep-it-claire:home-cube-copy:v51-art-order-home-v43-blog-html";
const FACE_ORDER = ["top", "front", "right", "back", "left", "bottom"];
const ART_CLASSES = ["one", "two", "three", "four", "five", "six"];
const STOPS = [
  { rx: 90, ry: 0 },
  { rx: 0, ry: 0 },
  { rx: 0, ry: -90 },
  { rx: 0, ry: -180 },
  { rx: 0, ry: -270 },
  { rx: -90, ry: -360 },
];

const dom = {
  body: document.body,
  cube: document.getElementById("cube"),
  scrollEl: document.getElementById("scroll-container"),
  sceneStrip: document.getElementById("scene-strip"),
  hudPct: document.getElementById("hud-pct"),
  progFill: document.getElementById("progress-fill"),
  sceneName: document.getElementById("scene-name"),
  cursorLight: document.getElementById("cursor-light"),
  editCopy: document.getElementById("edit-copy"),
};

let sections = [];
let sceneDots = [];
let revealEls = [];
let sectionTops = [];
let lastSceneIndex = -1;
let maxScroll = 1;
let targetProgress = 0;
let smoothProgress = 0;
let velocity = 0;
let lastNow = performance.now();
let anchorAnim = null;
let editing = false;
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeStyle(value, fallback) {
  return /^#[0-9a-f]{3,8}$/i.test(value || "") ? value : fallback;
}

function renderCubeFace(scene, index) {
  const artClass = ART_CLASSES[index] || ART_CLASSES[0];

  return `
    <div class="face" data-face="${FACE_ORDER[index]}" data-scene-id="${escapeHTML(scene.id)}">
      <div class="cube-art ${artClass}" aria-hidden="true"></div>
    </div>
  `;
}

function renderStats(stats = []) {
  if (!stats.length) return "";
  return `
    <div class="stat-row">
      ${stats
        .map(
          (stat) => `
            <div class="stat">
              <span class="stat-value">${escapeHTML(stat.value)}</span>
              <span class="stat-label">${escapeHTML(stat.label)}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTags(tags = []) {
  if (!tags.length) return "";
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`).join("")}</div>`;
}

function renderButtons(ctas = []) {
  if (!ctas.length) return "";
  return `
    <div class="cta-row">
      ${ctas
        .map((cta) => {
          const classes = ["button", cta.type === "ghost" ? "ghost" : "primary"].join(" ");
          const target = cta.external ? ' target="_blank" rel="noreferrer"' : "";
          return `<a class="${classes}" href="${escapeHTML(cta.href)}"${target}>${escapeHTML(cta.label)}</a>`;
        })
        .join("")}
    </div>
  `;
}

function renderSection(scene, index) {
  const cardSide = scene.side === "right" ? "right" : scene.side === "center" ? "center" : "left";
  const accent = safeStyle(scene.accent, "#dfff73");
  const ink = safeStyle(scene.ink, "#101010");
  return `
    <section class="story-section" id="s${index}" data-scene-id="${escapeHTML(scene.id)}">
      <article class="story-card ${cardSide}" style="--card-bg: ${accent}; --card-ink: ${ink}">
        <span class="kicker">${escapeHTML(scene.kicker || scene.label || "Keep it Claire")}</span>
        <h1 class="story-title">${escapeHTML(scene.title)}</h1>
        <p class="story-body">${escapeHTML(scene.body)}</p>
        ${renderTags(scene.tags)}
        ${renderStats(scene.stats)}
        ${renderButtons(scene.ctas)}
      </article>
    </section>
  `;
}

function renderPage() {
  dom.cube.innerHTML = SCENES.map(renderCubeFace).join("");
  dom.sceneStrip.innerHTML = SCENES.map(
    (scene, index) => `<a class="scene-dot${index === 0 ? " active" : ""}" href="#s${index}" aria-label="${escapeHTML(scene.shortName || scene.title)}"></a>`,
  ).join("");
  dom.scrollEl.innerHTML = SCENES.map(renderSection).join("");
  sections = [...document.querySelectorAll(".story-section")];
  sceneDots = [...document.querySelectorAll(".scene-dot")];
  revealEls = [...document.querySelectorAll(".kicker, .story-title, .story-body, .tag-row, .stat-row, .button")];
}

function buildSectionTops() {
  sectionTops = sections.map((section) => section.getBoundingClientRect().top + window.scrollY);
}

function sceneIndexFromScroll(y) {
  const mid = y + innerHeight * 0.5;
  let index = 0;
  for (let i = 0; i < sectionTops.length; i += 1) {
    if (mid >= sectionTops[i]) index = i;
  }
  return Math.min(index, SCENES.length - 1);
}

function progressForSceneIndex(index) {
  if (SCENES.length < 2) return 0;
  const safeIndex = Math.max(0, Math.min(SCENES.length - 1, index));
  return safeIndex / (SCENES.length - 1);
}

function cubeProgressFromScroll(y) {
  if (SCENES.length < 2 || sectionTops.length < 2) return 0;
  const first = sectionTops[0];
  const last = sectionTops[Math.min(SCENES.length - 1, sectionTops.length - 1)];
  const span = Math.max(1, last - first);
  return Math.max(0, Math.min(1, (y - first) / span));
}

function resize() {
  maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  buildSectionTops();
  targetProgress = progressForSceneIndex(sceneIndexFromScroll(scrollY));
  smoothProgress = targetProgress;
}

function easeIO(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function setCubeTransform(progress) {
  if (SCENES.length < 2) return;
  const t = progress * (SCENES.length - 1);
  const index = Math.min(Math.floor(t), SCENES.length - 2);
  const f = easeIO(t - index);
  const current = STOPS[index];
  const next = STOPS[index + 1];
  const rx = current.rx + (next.rx - current.rx) * f;
  const ry = current.ry + (next.ry - current.ry) * f;
  dom.cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
}

function updateHUD(index, progress = progressForSceneIndex(index)) {
  const pct = Math.round(progress * 100);
  dom.hudPct.textContent = `${String(pct).padStart(3, "0")}%`;
  dom.progFill.style.width = `${pct}%`;

  if (index === lastSceneIndex) return;
  lastSceneIndex = index;
  const scene = SCENES[index];
  const accent = safeStyle(scene.accent, "#dfff73");
  dom.body.style.setProperty("--active-accent", accent);
  dom.sceneName.textContent = scene.shortName || scene.kicker || scene.title;
  sceneDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}

function stopAnchorAnim() {
  if (anchorAnim) cancelAnimationFrame(anchorAnim);
  anchorAnim = null;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollToY(targetY, duration = 900, targetIndex = null) {
  stopAnchorAnim();
  velocity = 0;
  const startY = window.scrollY;
  const diff = targetY - startY;
  const start = performance.now();
  const lockedIndex = Number.isFinite(targetIndex) ? targetIndex : sceneIndexFromScroll(targetY);

  const tick = (now) => {
    const pct = Math.min(1, (now - start) / duration);
    const y = startY + diff * easeInOutCubic(pct);
    window.scrollTo(0, y);
    targetProgress = progressForSceneIndex(lockedIndex);
    if (pct < 1) anchorAnim = requestAnimationFrame(tick);
    else anchorAnim = null;
  };

  anchorAnim = requestAnimationFrame(tick);
}

function restoreEditableCopy() {
  const saved = localStorage.getItem(COPY_KEY);
  if (!saved) return;
  try {
    const copies = JSON.parse(saved);
    document.querySelectorAll(".story-card").forEach((card, index) => {
      if (copies[index]) card.innerHTML = copies[index];
    });
    revealEls = [...document.querySelectorAll(".kicker, .story-title, .story-body, .tag-row, .stat-row, .button")];
  } catch {
    localStorage.removeItem(COPY_KEY);
  }
}

function setEditMode(enabled) {
  document.querySelectorAll(".story-card").forEach((card) => {
    card.contentEditable = enabled ? "true" : "false";
  });
  dom.editCopy.textContent = enabled ? "Save copy" : "Edit copy";

  if (!enabled) {
    const copies = [...document.querySelectorAll(".story-card")].map((card) => card.innerHTML);
    localStorage.setItem(COPY_KEY, JSON.stringify(copies));
  }
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  revealEls.forEach((element) => observer.observe(element));
}

function initPointerLight() {
  window.addEventListener(
    "pointermove",
    (event) => {
      dom.body.classList.add("has-cursor");
      dom.body.style.setProperty("--mx", `${(event.clientX / innerWidth) * 100}%`);
      dom.body.style.setProperty("--my", `${(event.clientY / innerHeight) * 100}%`);
      dom.cursorLight.style.left = `${event.clientX}px`;
      dom.cursorLight.style.top = `${event.clientY}px`;
    },
    { passive: true },
  );
}

function initEvents() {
  if (motionAllowed) {
    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const linePx = 16;
        const pagePx = innerHeight * 0.9;
        const delta = event.deltaMode === 1 ? event.deltaY * linePx : event.deltaMode === 2 ? event.deltaY * pagePx : event.deltaY;
        if (Math.abs(delta) < 5) return;
        stopAnchorAnim();
        velocity += delta;
        velocity = Math.max(-620, Math.min(620, velocity));
      },
      { passive: false },
    );
  }

  window.addEventListener(
    "scroll",
    () => {
      targetProgress = progressForSceneIndex(sceneIndexFromScroll(scrollY));
    },
    { passive: true },
  );

  window.addEventListener("resize", resize);

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#s"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const index = sections.indexOf(target);
    const y = index >= 0 ? sectionTops[index] : target.getBoundingClientRect().top + window.scrollY;
    smoothScrollToY(Math.max(0, y), 900, index);
  });

  dom.editCopy.addEventListener("click", () => {
    editing = !editing;
    setEditMode(editing);
  });
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min((now - lastNow) / 1000, 0.05);
  lastNow = now;

  velocity *= Math.pow(Math.abs(velocity) > 200 ? 0.8 : 0.9, dt * 60);
  if (Math.abs(velocity) < 0.01) velocity = 0;
  if (Math.abs(velocity) > 0.2) {
    const next = Math.max(0, Math.min(scrollY + velocity * 0.1, maxScroll));
    window.scrollTo(0, next);
    targetProgress = progressForSceneIndex(sceneIndexFromScroll(next));
  }

  const activeIndex = sceneIndexFromScroll(scrollY);
  targetProgress = progressForSceneIndex(activeIndex);
  smoothProgress += (targetProgress - smoothProgress) * (1 - Math.exp(-dt * 8));
  smoothProgress = Math.max(0, Math.min(1, smoothProgress));
  updateHUD(activeIndex, smoothProgress);
  setCubeTransform(smoothProgress);
}

if (SCENES.length) {
  renderPage();
  restoreEditableCopy();
  initRevealObserver();
  initPointerLight();
  initEvents();
  resize();
  requestAnimationFrame(frame);
} else {
  dom.scrollEl.innerHTML = `
    <section class="story-section">
      <article class="story-card">
        <span class="kicker">Missing config</span>
        <h1 class="story-title">Home Cube needs content.</h1>
        <p class="story-body">请检查 ./content/home-cube.config.js 是否正确加载。</p>
      </article>
    </section>
  `;
}
