import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "关于 Kual — 产品型工程师与 AI Builder",
  description: "认识 Kual：在产品、工程与 AI 之间，把复杂问题变成清晰、可用、可复利的系统。",
};

const values = [
  ["01", "完整胜过局部", "不只解决一个页面或一段代码，也关心目标、链路与真实结果。"],
  ["02", "边界带来自由", "先说清楚什么不做，再把有限精力放到最重要的部分。"],
  ["03", "系统需要被使用", "只有进入日常、能够持续运转的结构，才算真正成立。"],
  ["04", "输出让经验复利", "写作不是汇报，而是把模糊经验压缩成可以复用的判断。"],
];

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-hero about-page-hero">
        <p className="eyebrow">ABOUT / KUAL</p>
        <h1>我想成为一个<br /><em>完整的问题解决者。</em></h1>
        <p className="page-deck">在产品判断、工程实现与 AI 协作之间工作，也用写作校准自己的思考。</p>
      </section>

      <section className="profile-intro section-shell">
        <div className="profile-label"><span>K</span><p>PRODUCT-MINDED<br />ENGINEER</p></div>
        <div className="profile-copy">
          <p className="lead">我叫 Kual，一名产品型工程师和 AI Builder。</p>
          <p>我习惯从一个朦胧的需求开始：先理解人真正遇到了什么，再拆出产品边界、工程路径与验证标准。代码是我使用最久的工具，但我关心的从来不只是代码。</p>
          <p>最近几年，我把注意力放在 AI Agent 上。我相信它不该只是一个回答问题的窗口，而应该进入长期上下文、真实流程与结果反馈中，成为可以持续协作的系统。</p>
        </div>
      </section>

      <section className="value-section section-shell">
        <div className="section-kicker light"><span>01</span><p>WHAT I VALUE / 我的判断</p></div>
        <div className="value-list">
          {values.map(([index, title, copy]) => <article key={index}><span>{index}</span><h2>{title}</h2><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="now-section section-shell">
        <div className="section-kicker"><span>02</span><p>NOW / 此刻关注</p></div>
        <div className="now-grid">
          <h2>把长期方向，落实到今天可验证的一步。</h2>
          <div>
            <p><strong>构建</strong>让 Agent 进入产品与个人工作流的真实闭环。</p>
            <p><strong>学习</strong>AI 原生产品、上下文工程与复杂系统的设计方法。</p>
            <p><strong>写作</strong>产品判断、工程实践，以及人与 AI 如何共同工作。</p>
          </div>
        </div>
      </section>

      <section className="page-cta">
        <p className="eyebrow">READ THE THINKING</p>
        <h2>简历告诉你我做过什么，<br />文章告诉你我如何思考。</h2>
        <a className="primary-link" href="/blog">去读文章 <span aria-hidden="true">↘</span></a>
      </section>
      <SiteFooter />
    </main>
  );
}
