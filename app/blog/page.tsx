import type { Metadata } from "next";
import { ArticleCard, SiteFooter, SiteHeader } from "../components";
import { articles } from "../content";

export const metadata: Metadata = {
  title: "文章 — Kual",
  description: "Kual 关于 AI、产品、系统与长期工作的文章和工作笔记。",
};

export default function BlogPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero blog-page-hero">
        <p className="eyebrow">WRITING / 文章</p>
        <h1><span>把经验写下来，</span><em>让判断开始复利。</em></h1>
        <p className="page-deck">关于 AI、产品、系统，以及怎样更有意识地工作与生活。</p>
      </section>
      <section className="blog-index section-shell">
        <div className="blog-index-head">
          <p>ALL NOTES / {String(articles.length).padStart(2, "0")}</p>
          <p>按时间倒序</p>
        </div>
        <div className="article-grid article-grid-index">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>
      <section className="blog-note section-shell">
        <p>写作原则</p>
        <blockquote>不追逐每一个热点。只写那些经过实践，仍然值得留下的信号。</blockquote>
      </section>
      <SiteFooter />
    </main>
  );
}
