import AVSelector from "@/components/av-selector";
import { getRecentSelections } from "@/app/actions";
import dayjs from "dayjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "名刺代わりのAV10選メーカー",
  description: "名刺代わりのAV10選メーカーです。",
  openGraph: {
    title: "名刺代わりのAV10選メーカー",
    description: "名刺代わりのAV10選メーカーです。",
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
    description: "名刺代わりのAV10選メーカーです。",
    images: ["/AV.png"],
  },
};

export default async function Home() {
  const recentSelections = await getRecentSelections();

  // Date オブジェクトを dayjs を使って ISO 文字列に変換
  const serializedSelections = recentSelections.map((selection) => ({
    ...selection,
    created_at: dayjs(selection.created_at).format()
  }));

  return <AVSelector initialRecentSelections={serializedSelections} />;
}
