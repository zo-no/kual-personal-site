import type { Metadata } from "next";
import { MoreWriting, SiteFooter, SiteHeader } from "../../components";
import { articles } from "../../content";

const article = articles[0];

export const metadata: Metadata = { title: `${article.title} — Kual`, description: article.summary };

export default function KnowledgeBaseArticle() {
  return (
    <main>
      <SiteHeader />
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
            <p className="prose-lead">很长一段时间，我一直在折腾个人知识库。用过不同的软件，也尝试过 PARA、GTD 和 Zettelkasten。后来我意识到，真正变化的不是工具，而是我在不同阶段对知识库的定位。</p>
            <h2>从保存资料，到推动事情</h2>
            <p>最早，我只希望知识库能帮我把文章、想法、学习笔记和项目资料保存下来。那时最有用的原则是：如非必要，勿增实体。几行内容不用单独拆文件，少量同类文件不用提前建文件夹，也不要为了想象中的以后搭出一座空城。</p>
            <p>但很快我发现，记录本身不会推动事情。文档越来越多，知识却可能永远沉在原地。于是我引入 GTD：收集、判断、进入项目，再把真正的行动交给待办工具。知识库开始从资料仓库变成项目的上下文。</p>
            <h2>Agent 进入之后，旧结构不够用了</h2>
            <p>当我开始高强度使用 Codex、Claude Code 一类的 Agent，问题再次改变。人可以靠记忆和隐含语境补全信息，Agent 每次进入系统却必须重新判断：这是什么项目，哪些是事实，哪些是建议，什么能改，下一步在哪里。</p>
            <blockquote>任何具备足够上下文、能够启动一轮的任务，都不应该被长期冻结在“以后再说”里。</blockquote>
            <p>真正的挑战不是让 AI 读到更多文件，而是让它每次都能快速找到边界、状态与下一步。知识库因此需要从“按资料类型分类”，进一步转向“按项目隔离上下文”。</p>
            <h2>我的改法：项目制文件库</h2>
            <p>我给它的定位很明确：知识库是长期上下文的位置，不是执行器。提醒、调度、Todo 与自动化运行各有更适合的工具；知识库负责保存事实、同步状态，并让人和 Agent 都能稳定读懂一个项目。</p>
            <p>每个项目绝对独立。代码项目把需求、技术文档和实现放在一起；写作项目把大纲、素材、初稿和复盘放在一起。Agent 进入一个项目时，只需要加载这一条上下文，不必先理解我的整个世界。</p>
            <h3>项目内部仍然可以容纳流程</h3>
            <p>项目制不是抛弃 GTD，而是把流程收进项目。摄影项目可以按“收集—策划—作品—复盘”组织，写作项目可以按“选题—调研—结构—初稿—质检”组织。目录本身就是这个项目的工作说明。</p>
            <p>随机想法也不需要破坏结构。把收集箱本身视作一个项目，定期由人或 Agent 做一次分流，就能让输入进入正确的长期上下文。</p>
            <h2>最小的 AI 应用</h2>
            <p>当项目拥有稳定上下文，Agent 能读懂边界，自动化可以周期性运行，知识库就不再是静态文件夹，而会变成持续运转的单元。</p>
            <blockquote>一个项目 + Agent + 自动化 = 最小的 AI 应用。</blockquote>
            <p>这套方案不是终点，但它给出了一个具体的判断标准：你有没有为自己的工作建立稳定的上下文结构？当结构成立之后，AI 才不只是偶尔帮忙的工具，而能成为真正进入长期工作的协作者。</p>
          </div>
        </div>
      </article>
      <MoreWriting currentSlug={article.slug} />
      <SiteFooter />
    </main>
  );
}
