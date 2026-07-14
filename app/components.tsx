/* eslint-disable @next/next/no-html-link-for-pages */
import { articles, type ArticleSummary } from "./content";
import type { CSSProperties } from "react";

const signalParticles = Array.from({ length: 44 }, (_, index) => ({
  x: (index * 37 + 11) % 100,
  y: ((index * 61 + 17) % 188) - 94,
  size: 1.2 + (index % 4) * 0.65,
  duration: 5.8 + (index % 8) * 0.72,
  delay: -(index % 11) * 0.63,
  drift: 16 + (index % 7) * 7,
}));

export function ParticleField() {
  return (
    <div className="particle-system" aria-hidden="true">
      <div className="signal-beam" />
      <div className="wave-stack">
        <span className="wave-trace wave-trace-one" />
        <span className="wave-trace wave-trace-two" />
        <span className="wave-trace wave-trace-three" />
        <span className="wave-trace wave-trace-four" />
      </div>
      <div className="particle-stream">
        {signalParticles.map((particle, index) => (
          <span
            className="field-particle"
            key={index}
            style={{
              "--particle-x": `${particle.x}%`,
              "--particle-y": `${particle.y}px`,
              "--particle-size": `${particle.size}px`,
              "--particle-duration": `${particle.duration}s`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-drift": `${particle.drift}px`,
            } as CSSProperties}
          />
        ))}
      </div>
      <canvas className="signal-canvas" data-signal-canvas />
      <span className="core-ripple core-ripple-one" />
      <span className="core-ripple core-ripple-two" />
      <span className="core-ripple core-ripple-three" />
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
        <a href="/about">关于</a>
        <a href="/blog">文章</a>
        <a href="/#exploring">正在做</a>
      </nav>
      <span className="header-note">BEIJING · 2026</span>
    </header>
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
    <article className="article-card">
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
