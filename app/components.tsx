/* eslint-disable @next/next/no-html-link-for-pages */
import { articles, type ArticleSummary } from "./content";

export function ParticleField() {
  return (
    <div className="particle-system" aria-hidden="true">
      <svg className="signal-curve-fallback" viewBox="0 0 800 520" preserveAspectRatio="none">
        <path className="fallback-raw-line" d="M0 438 L38 414 L70 430 L112 365 L148 392 L188 326 L226 352 L264 294 L302 318 L342 244 L380 278 L420 218 L458 252 L498 176 L538 218 L578 142 L616 184 L656 102 L698 138 L742 66 L800 90" />
        <path className="fallback-signal-line" d="M0 428 C120 398 168 354 250 318 C340 278 408 244 492 202 C586 155 672 116 800 82" />
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
        <a href="/#exploring">正在做</a>
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
