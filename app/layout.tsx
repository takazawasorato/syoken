import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "商圏分析アプリ",
  description: "住所と施設カテゴリから商圏を分析します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
