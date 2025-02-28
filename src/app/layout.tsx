import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgeCheckModal from "@/components/age-check-modal";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

const defaultOgImage = {
  url: "/AV.png",
  width: 1200,
  height: 630,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "名刺代わりのAV10選メーカー",
    template: "%s | 名刺代わりのAV10選メーカー",
  },
  description: "AVを10本選んで共有できます。",
  keywords: [
    "AV",
    "10本選",
    "名刺代わり",
    "AV10選",
    "名刺代わりのAV10選",
    "名刺代わりのAV10選メーカー",
  ],
  authors: [{ name: "solopreneurtaro" }],
  openGraph: {
    type: "website",
    siteName: "名刺代わりのAV10選メーカー",
    title: "名刺代わりのAV10選メーカー",
    description: "あなたの好きなAVを10本選んで共有できます。",
    images: [defaultOgImage],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "名刺代わりのAV10選メーカー",
    description: "あなたの好きなAVを10本選んで共有できます。",
    images: [defaultOgImage],
    creator: "@solopreneurtaro",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col px-4">
          <header className="flex justify-center items-center text-center text-sm text-gray-500 py-4">
            <Link href="/">
              <h1 className="text-2xl text-center mb-4">
                #名刺代わりのAV10選メーカー
              </h1>
            </Link>
          </header>
          <main className="flex-grow">
            {children}
            <AgeCheckModal />
            <Analytics />
          </main>
          <footer className="flex justify-center items-center text-center text-sm text-gray-500 py-4">
            <p>
              Powered by{" "}
              <a href="https://affiliate.dmm.com/api/">FANZA Webサービス</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
