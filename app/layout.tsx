import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://81.70.8.30/kual/";
const siteUrl = configuredSiteUrl.endsWith("/") ? configuredSiteUrl : `${configuredSiteUrl}/`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KUAL — 产品型工程师与 AI Builder",
  description:
    "Kual 的个人介绍：在产品体验、工程实现与 AI Agent 之间，把模糊问题拆成能落地的系统。",
  openGraph: {
    title: "KUAL — 把模糊问题，拆成能落地的系统",
    description: "产品型工程师、AI Builder 与系统思考者 Kual 的个人网站。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "KUAL — Signal from noise" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KUAL — 把模糊问题，拆成能落地的系统",
    description: "产品型工程师、AI Builder 与系统思考者 Kual 的个人网站。",
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <script src="/site-effects.js?v=20260714-particle-clusters" defer />
      </body>
    </html>
  );
}
