import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgeCheckModal from "@/components/age-check-modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "名刺代わりのAV10選メーカー",
  description: "あなたの好きなAVを10本選んで共有できます。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
        <AgeCheckModal />
      </body>
    </html>
  );
}
