/*
  Keep it Claire Home Cube 配置文件

  长期维护时主要改这里：
  - title / kicker / body 控制每一张弹出卡片的文字。
  - ctas 控制按钮文字和跳转地址。
  - accent / ink 控制卡片主色与文字颜色。
  - side 控制卡片从左边还是右边出现。
  - images 控制 Cube 里的 moodboard 图片。每个 scene 建议保持 5 张图。
  - stats 控制数据面板，比如小红书粉丝、点赞、阅读。
*/

window.__HOME_CUBE_SCENES__ = [
  {
    id: "claire-room",
    label: "01 - Home",
    kicker: "Keep it Claire",
    title: "Claire 的个人网站，也是一间会翻面的工作室。",
    shortName: "Claire's room",
    body:
      "这里连接我的写作、艺术、内容创作和生活现场。我不想做一个完美人设，更想保留自由、轻巧、好奇和一点大胆建设的状态。",
    accent: "#c1b2ff",
    ink: "#101018",
    side: "left",
    ctas: [
      { label: "继续翻面", href: "#s1", type: "primary" },
      { label: "进入 Blog", href: "./blog.html", type: "ghost" },
    ],
    tags: ["free mind", "soft signal", "keep it claire"],
    images: [
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-01-forest-queen-close.jpg",
        alt: "Claire 的人物和小狗便签画",
      },
      {
        src: "./assets/artworks/originals/人物小像.jpg",
        alt: "Claire 的人物小像",
      },
      {
        src: "./assets/artworks/originals/日落云边岸🌙凝眸自照见，我即我所觅。_1_雨天小苹果🍎_来自小红书网页版.jpg",
        alt: "青绿色水面与日落洞口",
      },
      {
        src: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=900&q=80",
        alt: "柔和夕阳与远处地平线",
      },
      {
        src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
        alt: "建筑色块与几何构图",
      },
    ],
  },
  {
    id: "builder-artist",
    label: "02 - Builder / Artist",
    kicker: "AI-native builder + artist",
    title: "我关注 AI，也关注人的手感、模糊和玩心。",
    shortName: "Builder / artist",
    body:
      "我希望 AI 能自然融入人的工作流，成为一种更顺手、更懂上下文、也更会和人交互的能力。科技可以锋利，但未来要柔软。",
    accent: "#24aceb",
    ink: "#07121d",
    side: "right",
    ctas: [
      { label: "看 AI Blog", href: "./blog.html", type: "primary" },
      { label: "看 Art", href: "./art.html", type: "ghost" },
    ],
    tags: ["human in the loop", "skin in the game", "curious player"],
    images: [
      {
        src: "./assets/artworks/originals/不要再在冬季哭泣_26.01.11起.png",
        alt: "红蓝情绪人物画",
      },
      {
        src: "./assets/artworks/originals/人的皮肤之厚，大概不到半分，鲜红的热血，就循着那后面，在比密密层层地爬在墙壁上的槐蚕更其密的血管里奔流，散出温热。.png",
        alt: "黑底白线身体线稿",
      },
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-06-badge-workshop.jpg",
        alt: "彩色桌面和手绘徽章",
      },
      {
        src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80",
        alt: "霓虹城市夜色",
      },
      {
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        alt: "工作室桌面与电脑",
      },
    ],
  },
  {
    id: "ai-blog",
    label: "03 - AI Blog",
    kicker: "31 pieces and growing",
    title: "这里沉淀了我大半年关于 AI 的认知。",
    shortName: "AI Blog",
    body:
      "Blog 会放产品观察、模型理解、论文阅读、工作流拆解和真实使用体验。你可以先只看标题，想读哪篇再点开。",
    accent: "#dfff73",
    ink: "#111",
    side: "left",
    ctas: [
      { label: "进入 AI Blog", href: "./blog.html", type: "primary" },
      { label: "继续翻面", href: "#s3", type: "ghost" },
    ],
    tags: ["AI", "Product", "Research", "Notes"],
    stats: [
      { value: "31", label: "pieces" },
      { value: "AI", label: "main archive" },
      { value: "∞", label: "questions" },
    ],
    images: [
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-05-city-notebook-sketch.jpg",
        alt: "城市手账速写",
      },
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-03-agile-town-sketch.jpg",
        alt: "敏捷小镇速写",
      },
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-04-room-line-sketch.jpg",
        alt: "室内线稿",
      },
      {
        src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
        alt: "机器人与科技装置",
      },
      {
        src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        alt: "代码与屏幕",
      },
    ],
  },
  {
    id: "art-gallery",
    label: "04 - Art",
    kicker: "Art Gallery",
    title: "绘画、拼贴、色彩和那些不想失去的瞬间。",
    shortName: "Art Gallery",
    body:
      "Art 是我把模糊情绪变成可见形状的地方。它不是光滑的作品集，更像一个会翻面的盒子：每转一下，看见一种新的心情。",
    accent: "#ff89be",
    ink: "#151016",
    side: "right",
    ctas: [
      { label: "进入 Art Gallery", href: "./art.html", type: "primary" },
      { label: "继续翻面", href: "#s4", type: "ghost" },
    ],
    tags: ["Life Moments", "Emotion", "Resonance"],
    images: [
      {
        src: "./assets/artworks/originals/生万物，万物生🌱🌿🌳.PNG",
        alt: "绿色池塘与鸭子的绘画",
      },
      {
        src: "./assets/artworks/originals/女孩和小狗在爱尔兰🫧🎈我的第二幅绘画作品.PNG",
        alt: "女孩和小狗在红墙前的绘画作品",
      },
      {
        src: "./assets/artworks/originals/不要再在冬季哭泣_26.01.11起.png",
        alt: "冬季情绪绘画作品",
      },
      {
        src: "./assets/artworks/originals/IMG_3969.PNG",
        alt: "窗、海与猫的绘画作品",
      },
      {
        src: "./assets/artworks/originals/日落云边岸🌙凝眸自照见，我即我所觅。_1_雨天小苹果🍎_来自小红书网页版.jpg",
        alt: "日落云边岸绘画作品",
      },
    ],
  },
  {
    id: "creator-media",
    label: "05 - Creator",
    kicker: "Content creator",
    title: "我也在社媒里记录、表达和试验。",
    shortName: "Creator",
    body:
      "About 页会集中放我的小红书账号、微信公众号和更多平台入口。数据不是全部，但它能让你快速知道我在哪些地方持续发布内容。",
    accent: "#8ae5de",
    ink: "#091716",
    side: "left",
    ctas: [
      { label: "查看 About", href: "./about.html", type: "primary" },
      { label: "小红书主账号", href: "https://xhslink.com/m/2I4mk3DzXc0", type: "ghost", external: true },
    ],
    tags: ["小红书", "公众号", "即刻"],
    stats: [
      { value: "4K", label: "followers" },
      { value: "177K", label: "likes & saves" },
      { value: "700K", label: "top views" },
      { value: "110K", label: "top likes" },
    ],
    images: [
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-06-badge-workshop.jpg",
        alt: "彩色桌面上的手绘徽章",
      },
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-07-cat-tablet-window-sea.jpg",
        alt: "猫和 iPad 上的绘画作品",
      },
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-09-quirky-animal-doodles.jpg",
        alt: "怪诞可爱的小动物涂鸦",
      },
      {
        src: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=900&q=80",
        alt: "桌面上的创作工具",
      },
      {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
        alt: "日常生活和创作氛围",
      },
    ],
  },
  {
    id: "contact-work",
    label: "06 - Contact",
    kicker: "Open to AI-native work",
    title: "如果你想联系我，或者知道更 AI-native 的机会。",
    shortName: "Contact",
    body:
      "Claire 最近想去做一份更 AI-native 的工作：更靠近产品、模型、工作流和真实用户。如果你觉得我适合某个机会，欢迎介绍给我，也欢迎只是来聊聊。",
    accent: "#ff8f4e",
    ink: "#160f0a",
    side: "right",
    ctas: [
      { label: "发 Email", href: "mailto:xxclr27yzl@gmail.com", type: "primary" },
      { label: "回到开始", href: "#s0", type: "ghost" },
    ],
    tags: ["AI-native work", "Product", "Creative tech"],
    stats: [{ value: "email", label: "xxclr27yzl@gmail.com" }],
    images: [
      {
        src: "./assets/artworks/originals/2026-06-30-upload-01/2026-06-30-02-rain-walker-sketch.jpg",
        alt: "雨中散步的人速写",
      },
      {
        src: "./assets/artworks/originals/你用目光，为我下一场无声的雪25.09.06.jpeg",
        alt: "眼睛线稿",
      },
      {
        src: "./assets/artworks/originals/静候佳音.jpg",
        alt: "静候佳音室内线稿",
      },
      {
        src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
        alt: "明亮开放的工作空间",
      },
      {
        src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
        alt: "笔记和协作桌面",
      },
    ],
  },
];
