import { ArticleCard, ParticleField, SiteFooter, SiteHeader } from "./components";
import { articles } from "./content";

const practices = [
  { index: "01", title: "观察", copy: "先分清信号与噪声，理解问题为什么值得被解决。" },
  { index: "02", title: "拆解", copy: "把模糊目标变成边界、顺序与可以验证的结果。" },
  { index: "03", title: "构建", copy: "让产品判断进入工程实现，快速做出真实可用的版本。" },
  { index: "04", title: "复盘", copy: "把一次经验沉淀成系统，让下一次行动更轻、更准。" },
];

const explorations = [
  { id: "ai-native", index: "A", signalIndex: "01", title: "AI 原生产品", description: "探索 Agent 如何真正进入产品闭环，而不只是停留在一次对话。", tag: "PRODUCT × AI" },
  { id: "personal-os", index: "B", signalIndex: "02", title: "个人操作系统", description: "用目标地图、日记与自动化，把长期生活变成可持续迭代的系统。", tag: "SYSTEM × LIFE" },
  { id: "research-writing", index: "C", signalIndex: "03", title: "研究与表达", description: "从行业研究到公开写作，让判断被看见，也让知识开始复利。", tag: "RESEARCH × WRITING" },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <nav className="section-rail" aria-label="首页章节导航">
        <a href="#about" data-section-link="about" aria-label="关于我"><span>01</span></a>
        <a href="#practice" data-section-link="practice" aria-label="工作方法"><span>02</span></a>
        <a href="#writing" data-section-link="writing" aria-label="最近文章"><span>03</span></a>
      </nav>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-story">
          <div className="hero-copy">
            <p className="eyebrow hero-enter hero-enter-one">PRODUCT-MINDED ENGINEER · AI BUILDER</p>
            <h1 id="hero-title" className="hero-enter hero-enter-two">
              把模糊问题，<br /><em>拆成能落地的系统。</em>
            </h1>
            <p className="hero-intro hero-enter hero-enter-three">
              我是 Kual。我在产品体验、工程实现与 AI Agent 之间工作，
              喜欢找到噪声里的信号，把一次答案做成可以重复使用的方法。
            </p>
            <div className="hero-actions hero-enter hero-enter-four">
              <a className="primary-link" href="/blog">读我的文章 <span aria-hidden="true">↘</span></a>
              <a className="text-link" href="/about">先认识我</a>
            </div>
          </div>

          <div className="project-story-list" aria-label="正在探索的三个项目方向">
            {explorations.map((item) => (
              <article
                className="project-story"
                data-project-step={item.id}
                id={`story-${item.id}`}
                key={item.id}
              >
                <p className="project-story-meta"><span>{item.signalIndex}</span>{item.tag}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="signal-field" aria-label="AI 原生产品、个人操作系统与研究表达的三条项目信号线">
          <div className="field-grid" aria-hidden="true" />
          <ParticleField />
          <p className="field-label">PROJECT INDEX / SIGNAL EXTRACTION</p>
          {explorations.map((item) => (
            <a
              className={`signal-node project-signal-${item.signalIndex}`}
              data-project-signal={item.id}
              data-signal-copy={item.description}
              href={`#story-${item.id}`}
              key={item.id}
            ><span>{item.signalIndex}</span><strong>{item.title}</strong></a>
          ))}
          <div className="field-center" aria-hidden="true">
            <span data-filter-status>NOISE</span>
            <strong data-filter-value>/ 00</strong>
            <small data-filter-hint>SCROLL TO FILTER</small>
          </div>
          <p className="sr-only" data-filter-announcement aria-live="polite">三条项目线等待过滤</p>
          <p className="field-caption" data-field-caption>THREE PROJECT LINES / SCROLL TO FILTER</p>
        </div>
      </section>

      <section className="identity-strip" aria-label="个人关键词">
        <span>向未来看</span><span>先做成系统</span><span>让输出复利</span><span>保持对人的温度</span>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker"><span>01</span><p>ABOUT / 关于我</p></div>
        <div className="about-statement"><h2 id="about-title">理性让我建立结构，<br />好奇心让我不断越界。</h2></div>
        <div className="about-copy">
          <p>我不太满足于只完成一段代码，或者只给出一个漂亮界面。我更想理解：它解决了谁的问题，为什么这样工作，以及怎样让这次经验成为下一次的杠杆。</p>
          <p>所以我持续向产品、后端、AI、行业研究与写作拓展边界。不是为了拥有更多标签，而是为了提供一套更完整的解决方案。</p>
          <a className="inline-arrow" href="/about">完整介绍 <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="practice section-shell" id="practice" aria-labelledby="practice-title">
        <div className="section-kicker light"><span>02</span><p>HOW I WORK / 工作方法</p></div>
        <div className="practice-heading"><h2 id="practice-title">把思考变成动作。</h2><p>一套会随着每次实践继续升级的方法。</p></div>
        <ol className="practice-list">
          {practices.map((item) => <li key={item.index}><span className="practice-index">{item.index}</span><h3>{item.title}</h3><p>{item.copy}</p></li>)}
        </ol>
      </section>

      <section className="writing section-shell" id="writing" aria-labelledby="writing-title">
        <div className="section-kicker"><span>03</span><p>SELECTED WRITING / 最近文章</p></div>
        <div className="writing-heading">
          <h2 id="writing-title">记录我如何理解产品、AI 与系统。</h2>
          <a className="inline-arrow" href="/blog">全部文章 <span aria-hidden="true">→</span></a>
        </div>
        <div className="article-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
      </section>

      <section className="closing" id="contact" aria-labelledby="closing-title">
        <p className="eyebrow">A NOTE TO THE FUTURE</p>
        <h2 id="closing-title">先理解世界，再动手改变一点。</h2>
        <p>如果你也在研究 AI、产品与系统化工作，欢迎从任何你认识我的渠道，发来一句话。</p>
        <a className="closing-link" href="/blog">从文章开始 <span aria-hidden="true">→</span></a>
      </section>
      <SiteFooter />
    </main>
  );
}
