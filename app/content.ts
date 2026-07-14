export type ArticleSummary = {
  slug: string;
  number: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  summary: string;
  thesis: string;
};

export const articles: ArticleSummary[] = [
  {
    slug: "agent-knowledge-base",
    number: "01",
    category: "SYSTEM × AI",
    date: "2026.05.02",
    readTime: "9 MIN",
    title: "给 AI + 人类共生体的知识库搭建指南",
    summary:
      "当 Agent 进入工作流，知识库不再只是资料仓库，而应该成为人和 AI 共用的项目文件库。",
    thesis: "一个项目 + Agent + 自动化，可能就是最小的 AI 应用。",
  },
  {
    slug: "taste-in-ai-era",
    number: "02",
    category: "TASTE × PRODUCT",
    date: "2026.07",
    readTime: "6 MIN",
    title: "AI 时代，品味是删除的能力",
    summary:
      "AI 从不缺少答案，真正稀缺的是判断：什么应该留下，什么只是看起来正确的噪声。",
    thesis: "AI 负责生成，你负责判断什么该留下。",
  },
];
