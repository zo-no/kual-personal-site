const practices = [
  {
    index: "01",
    title: "观察",
    copy: "先分清信号与噪声，理解问题为什么值得被解决。",
  },
  {
    index: "02",
    title: "拆解",
    copy: "把模糊目标变成边界、顺序与可以验证的结果。",
  },
  {
    index: "03",
    title: "构建",
    copy: "让产品判断进入工程实现，快速做出真实可用的版本。",
  },
  {
    index: "04",
    title: "复盘",
    copy: "把一次经验沉淀成系统，让下一次行动更轻、更准。",
  },
];

const explorations = [
  {
    index: "A",
    title: "AI 原生产品",
    description:
      "探索 Agent 如何真正进入产品闭环，而不只是停留在一次对话。",
    tag: "PRODUCT × AI",
  },
  {
    index: "B",
    title: "个人操作系统",
    description:
      "用目标地图、日记与自动化，把长期生活变成可持续迭代的系统。",
    tag: "SYSTEM × LIFE",
  },
  {
    index: "C",
    title: "研究与表达",
    description:
      "从行业研究到公开写作，让判断被看见，也让知识开始复利。",
    tag: "RESEARCH × WRITING",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="KUAL 首页">
          KUAL<span className="wordmark-dot">.</span>
        </a>
        <nav aria-label="主导航">
          <a href="#about">关于</a>
          <a href="#practice">方法</a>
          <a href="#exploring">正在做</a>
        </nav>
        <span className="header-note">BEIJING · 2026</span>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-enter hero-enter-one">
            PRODUCT-MINDED ENGINEER · AI BUILDER
          </p>
          <h1 id="hero-title" className="hero-enter hero-enter-two">
            把模糊问题，
            <br />
            <em>拆成能落地的系统。</em>
          </h1>
          <p className="hero-intro hero-enter hero-enter-three">
            我是 Kual。我在产品体验、工程实现与 AI Agent 之间工作，
            喜欢找到噪声里的信号，把一次答案做成可以重复使用的方法。
          </p>
          <div className="hero-actions hero-enter hero-enter-four">
            <a className="primary-link" href="#exploring">
              看我正在构建什么 <span aria-hidden="true">↘</span>
            </a>
            <a className="text-link" href="#about">
              先认识我
            </a>
          </div>
        </div>

        <div className="signal-field" aria-label="产品、AI、系统与写作的思维连接图">
          <div className="field-grid" aria-hidden="true" />
          <p className="field-label">MY WORKING FIELD / 01</p>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="connector connector-one" aria-hidden="true" />
          <div className="connector connector-two" aria-hidden="true" />
          <div className="connector connector-three" aria-hidden="true" />
          <div className="signal-node node-product">
            <span>01</span>
            <strong>PRODUCT</strong>
          </div>
          <div className="signal-node node-ai">
            <span>02</span>
            <strong>AI</strong>
          </div>
          <div className="signal-node node-system">
            <span>03</span>
            <strong>SYSTEM</strong>
          </div>
          <div className="signal-node node-writing">
            <span>04</span>
            <strong>WRITING</strong>
          </div>
          <div className="field-center">
            <span>SIGNAL</span>
            <strong>/ NOISE</strong>
          </div>
          <p className="field-caption">OBSERVE → FRAME → BUILD → LEARN</p>
        </div>
      </section>

      <section className="identity-strip" aria-label="个人关键词">
        <span>向未来看</span>
        <span>先做成系统</span>
        <span>让输出复利</span>
        <span>保持对人的温度</span>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker">
          <span>01</span>
          <p>ABOUT / 关于我</p>
        </div>
        <div className="about-statement">
          <h2 id="about-title">
            理性让我建立结构，
            <br />
            好奇心让我不断越界。
          </h2>
        </div>
        <div className="about-copy">
          <p>
            我不太满足于只完成一段代码，或者只给出一个漂亮界面。我更想理解：
            它解决了谁的问题，为什么这样工作，以及怎样让这次经验成为下一次的杠杆。
          </p>
          <p>
            所以我持续向产品、后端、AI、行业研究与写作拓展边界。
            不是为了拥有更多标签，而是为了提供一套更完整的解决方案。
          </p>
        </div>
      </section>

      <section className="practice section-shell" id="practice" aria-labelledby="practice-title">
        <div className="section-kicker light">
          <span>02</span>
          <p>HOW I WORK / 工作方法</p>
        </div>
        <div className="practice-heading">
          <h2 id="practice-title">把思考变成动作。</h2>
          <p>一套会随着每次实践继续升级的方法。</p>
        </div>
        <ol className="practice-list">
          {practices.map((item) => (
            <li key={item.index}>
              <span className="practice-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="exploring section-shell" id="exploring" aria-labelledby="exploring-title">
        <div className="section-kicker">
          <span>03</span>
          <p>CURRENTLY EXPLORING / 正在构建</p>
        </div>
        <div className="exploring-heading">
          <h2 id="exploring-title">在确定的工作之外，追踪未来的需求。</h2>
          <p>这些主题正在我的工作、学习与长期输出里交叉生长。</p>
        </div>
        <div className="exploration-list">
          {explorations.map((item) => (
            <article key={item.index} className="exploration-item">
              <span className="exploration-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="exploration-tag">{item.tag}</span>
              <span className="exploration-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="closing" id="contact" aria-labelledby="closing-title">
        <p className="eyebrow">A NOTE TO THE FUTURE</p>
        <h2 id="closing-title">先理解世界，再动手改变一点。</h2>
        <p>
          如果你也在研究 AI、产品与系统化工作，欢迎从任何你认识我的渠道，
          发来一句话。
        </p>
        <a className="closing-link" href="#top">
          回到起点 <span aria-hidden="true">↑</span>
        </a>
      </section>

      <footer>
        <a className="wordmark footer-wordmark" href="#top">KUAL.</a>
        <p>BUILDING SYSTEMS FOR A MORE INTENTIONAL LIFE.</p>
        <p>© 2026</p>
      </footer>
    </main>
  );
}
