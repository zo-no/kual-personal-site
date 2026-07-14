import type { Metadata } from "next";
import { MoreWriting, ReadingProgress, SiteFooter, SiteHeader } from "../../components";
import { articles } from "../../content";

const article = articles[1];

export const metadata: Metadata = { title: `${article.title} — Kual`, description: article.summary };

export default function TasteArticle() {
  return (
    <main>
      <SiteHeader />
      <ReadingProgress />
      <article className="article-page">
        <header className="article-hero">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="article-summary">{article.summary}</p>
          <div className="article-byline"><span>{article.date}</span><span>{article.readTime}</span><span>BY KUAL</span></div>
        </header>
        <div className="article-layout">
          <aside className="article-aside"><span>THESIS</span><p>{article.thesis}</p></aside>
          <div className="prose">
            <p className="prose-lead">过去，我用 AI 写过很多代码和文字。模型越强，我越能感到一件有意思的事：AI 的输出几乎从不缺东西，但总是多东西。</p>
            <h2>AI 的问题，常常不是错，而是冗余</h2>
            <p>让 AI 解释一个概念，它会铺垫背景、展开论述，再总结重申。让它做一个页面，能用图标表达的地方可能仍要补一行文字；一眼就懂的按钮旁边，还要附上解释。</p>
            <p>工程里也一样。一个 MVP 明明只需要验证最核心的链路，AI 却很容易提前设计权限表、刷新令牌、未来模块和大量“可能有用”的字段。每一项单独看都正确，放到当前阶段却构成了噪声。</p>
            <blockquote>AI 的默认目标是“不遗漏”，而真正好的产品要求“不多余”。</blockquote>
            <p>这不是知识不足的问题，而是目标错位。它有能力生成更多，却很难替你决定什么值得留下。这个能力，我愿意称之为品味。</p>
            <h2>极简主义不是少，而是精准</h2>
            <p>极简主义常被误解成空白、克制与冷淡。对我来说，它更接近一种工程判断：把不必要的东西从结果里拿走，直到只剩下不能再少的部分。</p>
            <p>一个功能的缺席不一定是遗漏，也可能是清醒的取舍。一段解释被删除不一定损失信息，也可能让真正重要的内容终于出现。去掉什么、留下什么，需要你对目标有足够具体的认识。</p>
            <h2>怎样在 AI 协作中实践</h2>
            <h3>先给边界，而不是更多自由</h3>
            <p>不要只告诉 AI 需要什么，也要说清楚不需要什么、当前阶段是什么、输出到哪里为止。精准的约束往往比更长的提示词有效。</p>
            <h3>反向审查每一个元素</h3>
            <p>我习惯问：去掉它，意思变了吗？体验变差了吗？如果没有，就去掉。这个问题可以审查视觉元素、文字、逻辑、数据库表，也可以审查日程和信息输入。</p>
            <h3>让结果本身能够说明</h3>
            <p>好代码本身就是文档，好设计本身就是说明。如果一个界面需要大量文字才能解释清楚，首先该修改的往往不是说明，而是界面本身。</p>
            <h2>删除是一种责任</h2>
            <p>AI 时代，生成成本趋近于零，人的注意力却没有增加。真正稀缺的不再是信息，而是判断什么值得进入注意力。</p>
            <p>当然，极简主义不是所有场景的答案。商业产品有时需要可感知的丰富，年夜饭也需要超出效率的余量。判断力同样意味着知道什么时候不该删。</p>
            <blockquote>AI 负责生成，你负责判断什么该留下。</blockquote>
            <p>这不是审美偏好，而是产品力、认知效率，也是人与 AI 协作时不可外包的那部分责任。</p>
          </div>
        </div>
      </article>
      <MoreWriting currentSlug={article.slug} />
      <SiteFooter />
    </main>
  );
}
