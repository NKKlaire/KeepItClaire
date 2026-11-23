/* Progressive enhancement for imported articles; the source content stays intact. */
(() => {
  const content = document.getElementById('article-content');
  if (!content) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const videoPattern = /\.(?:mp4|mov|webm|m4v)(?:[?#]|$)/i;
  const isVideoLink = (link) => videoPattern.test(link.href) || videoPattern.test(link.textContent.trim());
  const hasMedia = (node) => !!node.querySelector('img, video') || [...node.querySelectorAll('a')].some(isVideoLink);

  // Remove only the generated wrapper heading, never an authored heading.
  content.querySelectorAll('.imported-article > h2').forEach((heading) => {
    if (heading.textContent.trim().toLowerCase() === 'read me') heading.hidden = true;
  });

  // Build a useful document outline from the actual h2/h3 headings.
  const headings = [...content.querySelectorAll('h2, h3')].filter((heading) => !heading.hidden);
  const toc = document.getElementById('article-toc');
  if (toc && headings.length) {
    toc.replaceChildren();
    toc.setAttribute('aria-label', '文章目录');
    const links = headings.map((heading, index) => {
      if (!heading.id) heading.id = `article-heading-${index + 1}`;
      const link = make('a', heading.tagName === 'H3' ? 'toc-subheading' : '', heading.textContent.trim());
      link.href = `#${heading.id}`;
      toc.append(link);
      return link;
    });
    const left = document.querySelector('.reader-left');
    const kicker = document.querySelector('.reader-map-kicker');
    if (kicker) kicker.textContent = '文章目录';
    const toggle = make('button', 'reader-toc-toggle', '文章目录');
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', 'article-toc');
    toggle.setAttribute('aria-expanded', 'false');
    left?.prepend(toggle);
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      left.classList.toggle('toc-open', open);
    });
    toc.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      left?.classList.remove('toc-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
    let ticking = false;
    const update = () => {
      const active = headings.reduce((chosen, heading, index) => heading.getBoundingClientRect().top <= 140 ? index : chosen, 0);
      links.forEach((link, index) => {
        link.classList.toggle('active', index === active);
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // A single media row is an authoring layout, not a data comparison.
  // Multi-row tables retain their row/column semantics and original cell content.
  [...content.querySelectorAll('table')].reverse().forEach((table, index) => {
    const rows = [...table.rows];
    const cells = [...(rows[0]?.cells || [])];
    const layoutOnly = rows.length === 1 && !table.querySelector('th') && cells.some(hasMedia)
      && cells.every((cell) => cell.colSpan === 1 && cell.rowSpan === 1);
    if (layoutOnly) {
      const gallery = make('div', 'reader-media-grid');
      const copyCells = cells.filter((cell) => !hasMedia(cell) && cell.textContent.trim());
      const split = copyCells.length > 0 && copyCells.length < cells.length;
      const story = split ? make('section', 'reader-story') : gallery;
      const copy = split ? make('div', 'reader-story-copy') : null;
      const media = split ? make('div', 'reader-story-media') : null;
      const mediaCount = cells.filter(hasMedia).length;
      if (mediaCount === 1) gallery.classList.add('reader-media-single');
      gallery.style.setProperty('--gallery-columns', Math.min(3, mediaCount));
      gallery.dataset.items = String(mediaCount);
      if (split) {
        media.append(gallery); story.append(copy, media);
      }
      cells.forEach((cell) => {
        const item = make('div', 'reader-media-item');
        const isCopy = copyCells.includes(cell);
        while (cell.firstChild) item.append(cell.firstChild);
        (split && isCopy ? copy : gallery).append(item);
      });
      table.replaceWith(story);
      return;
    }
    const wrapper = make('div', 'reader-table');
    const viewport = make('div', 'reader-table-scroll');
    const toolbar = make('div', 'reader-table-toolbar');
    const hint = make('span', '', '对比表 · 可横向滚动');
    viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', '对比表，可横向滚动查看全部列');
    viewport.id = `reader-table-${index}`;
    table.before(wrapper);
    wrapper.append(toolbar, viewport);
    toolbar.append(hint);
    viewport.append(table);
    table.style.setProperty('--reader-columns', Math.max(2, cells.length));
    const canStack = rows.length > 1 && cells.length > 1 && cells.every((cell) => !hasMedia(cell) && cell.textContent.trim().length < 80)
      && rows.every((row) => row.cells.length === cells.length && [...row.cells].every((cell) => cell.colSpan === 1 && cell.rowSpan === 1));
    if (canStack) {
      const labels = cells.map((cell) => cell.textContent.trim());
      const editorial = hasMedia(table);
      wrapper.classList.toggle('reader-table-editorial', editorial);
      rows[0].classList.add('reader-table-head');
      cells.forEach((cell) => { cell.setAttribute('role', 'columnheader'); });
      rows.slice(1).forEach((row) => {
        row.dataset.columns = String(cells.length);
        if (cells.length === 3 && hasMedia(row.cells[2])) row.classList.add('reader-record-evidence');
        [...row.cells].forEach((cell, i) => {
          cell.dataset.columnLabel = labels[i];
          cell.classList.toggle('reader-evidence-cell', hasMedia(cell));
        });
      });
      const switcher = make('button', 'reader-table-toggle');
      switcher.type = 'button';
      switcher.setAttribute('aria-controls', viewport.id);
      const applyMode = (stacked) => {
        wrapper.classList.toggle('reader-table-stacked', stacked);
        switcher.textContent = stacked ? '切换表格对照' : '切换图文阅读';
        switcher.setAttribute('aria-pressed', String(stacked));
        hint.textContent = stacked ? '图文对照' : '表格对照 · 可横向滚动';
      };
      toolbar.append(switcher);
      applyMode(editorial || window.matchMedia('(max-width: 800px)').matches);
      switcher.addEventListener('click', () => applyMode(!wrapper.classList.contains('reader-table-stacked')));
    }
  });

  // Full-image viewer: fit-width for long screenshots; native size when needed.
  const images = [...content.querySelectorAll('img')];
  let activeIndex = 0;
  let trigger = null;
  let previousOverflow = '';
  const dialog = make('dialog', 'reader-lightbox');
  dialog.setAttribute('aria-labelledby', 'reader-lightbox-title');
  const header = make('div', 'reader-lightbox-header');
  const title = make('h2', '', '查看图片');
  title.id = 'reader-lightbox-title';
  title.setAttribute('aria-live', 'polite');
  const actions = make('div', 'reader-lightbox-actions');
  const zoom = make('button', '', '原始尺寸');
  const zoomIn = make('button', '', '放大');
  const zoomOut = make('button', '', '缩小');
  let zoomScale = 1;
  const original = make('a', '', '打开原图');
  original.target = '_blank'; original.rel = 'noopener noreferrer';
  const close = make('button', '', '关闭');
  const stage = make('div', 'reader-lightbox-stage');
  stage.tabIndex = 0;
  stage.setAttribute('aria-label', '完整图片，可上下滚动查看');
  const fullImage = make('img', 'reader-full-image');
  const status = make('p', 'reader-lightbox-status');
  status.setAttribute('role', 'status');
  const footer = make('div', 'reader-lightbox-footer');
  const previous = make('button', '', '上一张');
  const next = make('button', '', '下一张');
  const instruction = make('span', '', '上下滚动查看完整图 · Esc 关闭');
  [zoom, zoomIn, zoomOut, close, previous, next].forEach((button) => { button.type = 'button'; });
  header.append(title, actions); actions.append(zoomOut, zoomIn, zoom, original, close);
  stage.append(status, fullImage); footer.append(previous, instruction, next);
  dialog.append(header, stage, footer); document.body.append(dialog);
  const renderImage = () => {
    const image = images[activeIndex];
    stage.classList.remove('reader-native-size');
    fullImage.style.width = ''; zoomScale = 1;
    zoom.disabled = true; zoomIn.disabled = true; zoomOut.disabled = true;
    zoom.textContent = '原始尺寸'; zoom.setAttribute('aria-pressed', 'false');
    status.hidden = false; status.textContent = '正在加载完整图片…';
    fullImage.hidden = true;
    fullImage.alt = image.alt;
    fullImage.onload = () => {
      status.hidden = true; fullImage.hidden = false;
      zoom.disabled = false; zoomIn.disabled = false; zoomOut.disabled = false;
    };
    fullImage.onerror = () => { status.textContent = '图片暂时无法加载，请使用「打开原图」重试。'; };
    fullImage.src = image.currentSrc || image.src;
    original.href = fullImage.src;
    title.textContent = `图片 ${activeIndex + 1} / ${images.length}`;
    previous.disabled = activeIndex === 0;
    next.disabled = activeIndex === images.length - 1;
    stage.scrollTop = 0; stage.scrollLeft = 0;
  };
  const openImage = (index, button) => {
    activeIndex = index; trigger = button; renderImage();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal(); close.focus();
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    trigger?.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => { if (activeIndex > 0) { activeIndex--; renderImage(); } });
  next.addEventListener('click', () => { if (activeIndex < images.length - 1) { activeIndex++; renderImage(); } });
  zoom.addEventListener('click', () => {
    const native = stage.classList.toggle('reader-native-size');
    fullImage.style.width = ''; zoomScale = 1;
    zoomIn.disabled = false; zoomOut.disabled = false;
    zoom.textContent = native ? '适应宽度' : '原始尺寸';
    zoom.setAttribute('aria-pressed', String(native));
  });
  const changeZoom = (multiplier) => {
    if (!fullImage.naturalWidth || fullImage.hidden) return;
    const currentWidth = fullImage.getBoundingClientRect().width;
    const targetWidth = Math.max(160, Math.min(fullImage.naturalWidth * 3, currentWidth * multiplier));
    stage.classList.add('reader-native-size');
    fullImage.style.width = `${targetWidth}px`;
    zoomScale = targetWidth / fullImage.naturalWidth;
    zoom.textContent = '适应宽度'; zoom.setAttribute('aria-pressed', 'true');
    zoomOut.disabled = targetWidth <= 160;
    zoomIn.disabled = zoomScale >= 3;
  };
  zoomIn.addEventListener('click', () => changeZoom(1.4));
  zoomOut.addEventListener('click', () => changeZoom(1 / 1.4));
  images.forEach((image, index) => {
    const figure = make('figure', 'reader-image');
    const button = make('button', 'reader-image-preview');
    button.type = 'button';
    button.setAttribute('aria-label', `查看完整图 ${index + 1}`);
    button.setAttribute('aria-haspopup', 'dialog');
    const caption = make('figcaption', '', `图 ${index + 1}`);
    // A linked image still exposes its original destination in the caption.
    const anchor = image.closest('a');
    if (anchor && anchor.querySelectorAll('img').length === 1 && !anchor.textContent.trim()) {
      const sourceLink = make('a', '', '原链接');
      sourceLink.href = anchor.href; sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer';
      caption.append(' · ', sourceLink); anchor.replaceWith(figure);
    } else if (anchor) anchor.after(figure);
    else image.before(figure);
    button.append(image); figure.append(button, caption);
    image.decoding = 'async';
    if (index > 3) image.loading = 'lazy';
    if (!image.alt || /^(?:image|img[_-])/i.test(image.alt) || /\.(?:png|jpe?g|webp)$/i.test(image.alt)) image.alt = `文章配图 ${index + 1}`;
    const sizePreview = () => {
      const width = image.naturalWidth || Number(image.getAttribute('width'));
      const height = image.naturalHeight || Number(image.getAttribute('height'));
      const isLong = width > 0 && height / width > 2.4;
      figure.classList.toggle('reader-image-long', isLong);
      figure.classList.toggle('reader-image-portrait', width > 0 && height / width > 1.25 && !isLong);
      if (!anchor) caption.textContent = `图 ${index + 1}${isLong ? ' · 长图' : ''}`;
    };
    sizePreview(); image.addEventListener('load', sizePreview);
    image.addEventListener('error', () => {
      figure.classList.add('reader-image-error');
      caption.textContent = `图 ${index + 1} · 预览未加载，点击重试或打开原图`;
    });
    button.addEventListener('click', (event) => { event.preventDefault(); openImage(index, button); });
  });

  // Feishu preview URLs are authenticated attachments, not public video streams.
  content.querySelectorAll('a').forEach((link) => {
    if (!isVideoLink(link)) return;
    const url = new URL(link.href, location.href);
    if (!['http:', 'https:'].includes(url.protocol)) return;
    const fileName = link.textContent.trim();
    const feishu = /(?:^|\.)feishu\.cn$/.test(url.hostname);
    const card = make('figure', 'reader-video');
    const label = make('div', 'reader-video-title', '视频演示');
    const description = make('p', 'reader-video-description', feishu ? '飞书附件 · 在原页面观看，可能需要登录' : '在原页面打开视频');
    link.before(card); card.append(label);
    const directVideo = !feishu && /\.(?:mp4|webm)(?:[?#]|$)/i.test(url.pathname);
    if (directVideo) {
      const video = make('video');
      video.controls = true; video.preload = 'none'; video.playsInline = true;
      video.src = url.href; video.setAttribute('aria-label', fileName || '视频演示');
      card.append(video);
      description.textContent = '点击播放；无法播放时可打开原视频';
    }
    link.textContent = directVideo ? '打开原视频' : '打开视频';
    link.className = 'reader-video-link'; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `打开视频：${fileName}`);
    const name = make('figcaption', '', fileName);
    card.append(description, link, name);
  });
  content.querySelectorAll('video').forEach((video) => {
    video.controls = true; video.preload = 'none'; video.playsInline = true;
    video.removeAttribute('autoplay');
  });
  content.querySelectorAll('iframe').forEach((frame) => {
    frame.loading = 'lazy';
    if (!frame.title) frame.title = '嵌入内容';
    const wrapper = make('div', 'reader-embed');
    frame.before(wrapper); wrapper.append(frame);
  });

  // A gallery has one affordance and one visual rhythm, not repeated instructions.
  content.querySelectorAll('.reader-media-grid').forEach((gallery) => {
    const count = gallery.querySelectorAll('.reader-image').length;
    if (!count) return;
    const group = make('div', 'reader-gallery-group');
    const caption = make('div', 'reader-gallery-label', `${count} 张配图 · 点击放大`);
    gallery.before(group); group.append(caption, gallery);
    const attachments = [...gallery.children].filter((item) => !item.querySelector('img') && item.querySelector('.reader-video, video'));
    if (attachments.length) {
      const attachmentList = make('div', 'reader-gallery-attachments');
      attachmentList.append(...attachments); group.append(attachmentList);
    }
    gallery.style.setProperty('--gallery-columns', Math.min(4, gallery.children.length));
    gallery.classList.toggle('reader-media-single', gallery.children.length === 1);
    if (count > 1) {
      gallery.tabIndex = 0;
      gallery.setAttribute('role', 'region');
      gallery.setAttribute('aria-label', `${count} 张配图，可横向滚动`);
    }
  });

  const toolbar = make('div', 'reader-preferences');
  toolbar.setAttribute('aria-label', '阅读设置');
  const sizeLabel = make('label', '', '正文字号');
  const sizeSelect = make('select');
  sizeSelect.setAttribute('aria-label', '正文字号');
  [['16', '标准'], ['18', '较大'], ['20', '大字']].forEach(([value, label]) => {
    const option = make('option', '', label); option.value = value; sizeSelect.append(option);
  });
  sizeLabel.append(sizeSelect); toolbar.append(sizeLabel);
  sizeSelect.addEventListener('change', () => content.style.setProperty('--reader-font-size', `${sizeSelect.value}px`));
  if (images.length) {
    const browse = make('button', '', `浏览配图 · ${images.length}`); browse.type = 'button';
    browse.addEventListener('click', () => openImage(0, browse)); toolbar.append(browse);
  }
  document.querySelector('.article-hero-card')?.append(toolbar);
  const progress = make('progress', 'reader-progress');
  progress.max = 100; progress.value = 0; progress.setAttribute('aria-label', '文章阅读进度');
  document.body.prepend(progress);
  let progressPending = false;
  const updateProgress = () => {
    const height = content.offsetHeight - innerHeight;
    progress.value = height > 0 ? Math.max(0, Math.min(100, -content.getBoundingClientRect().top / height * 100)) : 100;
    progressPending = false;
  };
  window.addEventListener('scroll', () => {
    if (!progressPending) { progressPending = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();
