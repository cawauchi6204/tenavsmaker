import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "名刺代わりのAV10選メーカー",
  description: "あなたの好きなAVを10本選んでシェアしよう",
  openGraph: {
    title: "名刺代わりのAV10選メーカー",
    description: "あなたの好きなAVを10本選んでシェアしよう",
    images: [
      {
        url: "/AV.png",
        width: 1200,
        height: 630,
        alt: "名刺代わりのAV10選メーカー",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "名刺代わりのAV10選メーカー",
    description: "あなたの好きなAVを10本選んでシェアしよう",
    images: ["/AV.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
