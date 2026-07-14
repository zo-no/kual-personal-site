/* eslint-disable @next/next/no-html-link-for-pages */
import { articles, type ArticleSummary } from "./content";

export function ParticleField() {
  return (
    <div className="particle-system" aria-hidden="true">
      <svg className="signal-curve-fallback" viewBox="0 0 800 520" preserveAspectRatio="none">
        <path className="fallback-project-line fallback-project-one" d="M0 132 C112 126 176 102 270 116 C372 132 432 96 532 108 C626 120 698 88 800 98" />
        <path className="fallback-project-line fallback-project-two" d="M0 268 C96 248 174 274 260 252 C356 228 446 274 540 246 C640 216 706 244 800 218" />
        <path className="fallback-project-line fallback-project-three" d="M0 414 C116 430 178 386 276 404 C374 422 444 374 540 392 C638 410 712 360 800 372" />
      </svg>
      <canvas className="signal-canvas" data-signal-canvas />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="KUAL 首页">
        KUAL<span className="wordmark-dot">.</span>
      </a>
      <nav aria-label="主导航">
        <a href="/about" data-route="about">关于</a>
        <a href="/blog" data-route="blog">文章</a>
        <a href="/#story-ai-native">正在做</a>
      </nav>
      <span className="header-note">BEIJING · 2026</span>
    </header>
  );
}

export function ReadingProgress() {
  return (
    <div className="reading-progress" aria-hidden="true">
      <span data-reading-progress />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <a className="wordmark footer-wordmark" href="/">KUAL.</a>
      <p>BUILDING SYSTEMS FOR A MORE INTENTIONAL LIFE.</p>
      <p>© 2026</p>
    </footer>
  );
}

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="article-card" data-article-number={article.number}>
      <div className="article-card-meta">
        <span>{article.number}</span>
        <span>{article.category}</span>
      </div>
      <div className="article-card-body">
        <p className="article-date">{article.date} · {article.readTime}</p>
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
      <a href={`/blog/${article.slug}`} aria-label={`阅读：${article.title}`}>
        阅读文章 <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export function MoreWriting({ currentSlug }: { currentSlug: string }) {
  const next = articles.find((article) => article.slug !== currentSlug) ?? articles[0];
  return (
    <aside className="more-writing">
      <p className="eyebrow">KEEP READING</p>
      <a href={`/blog/${next.slug}`}>
        <span>下一篇</span>
        <strong>{next.title}</strong>
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
