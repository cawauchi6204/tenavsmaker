import AVSelector from "@/components/av-selector";
import { getRecentSelectionsWithItems } from "@/app/actions";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "名刺代わりのAV選メーカー",
  description: "名刺代わりのAV選メーカーです。",
  openGraph: {
    title: "名刺代わりのAV選メーカー",
    description: "名刺代わりのAV選メーカーです。",
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
    title: "名刺代わりのAV選メーカー",
    description: "名刺代わりのAV選メーカーです。",
    images: ["/AV.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#ffa31a",
};
export const dynamic = "force-dynamic";

export default async function Home() {
  // セレクションとそれに関連するアイテムを取得
  const selectionsWithItems = await getRecentSelectionsWithItems();

  return (
    <div className="container mx-auto pb-8">
      {/* AVセレクターコンポーネント */}
      <AVSelector />

      {/* セレクションとそれに関連するAVパッケージを表示 */}
      <div className="max-w-[800px] mx-auto px-4 pb-8">
        <p className="text-white">これまで作成された名刺代わりのAV選</p>
        {selectionsWithItems.map((selectionWithItems) => (
          <div key={selectionWithItems.selection.id} className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#ffa31a]">
                {selectionWithItems.selection.title}
              </h2>
              <Link
                href={`/selections/${selectionWithItems.selection.id}`}
                className="hover:underline text-sm"
              >
                すべて見る →
              </Link>
            </div>

            {/* 横スクロール可能なAVパッケージリスト */}
            <div className="relative">
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {selectionWithItems.items.map((item) => (
                    <div
                      key={item.package_id}
                      className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 min-w-[220px] max-w-[220px]"
                    >
                      <Link href={item.fanza_url} className="block">
                        <div className="aspect-w-3 aspect-h-4 relative">
                          <Image
                            src={item.image_url}
                            alt={item.package_title}
                            className="object-cover w-full h-full hover:opacity-90 transition-opacity duration-300"
                            width={300}
                            height={400}
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-white text-sm font-bold line-clamp-2 mb-2">
                            {item.package_title}
                          </h3>
                          {item.comment && (
                            <p className="text-pink-400 text-xs italic line-clamp-2 mb-2">
                              {item.comment}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
