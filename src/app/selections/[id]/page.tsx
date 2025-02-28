import { getSelectionItems, getSelection } from "../../actions";
import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

// ページを常に動的にレンダリングするように設定
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const selection = await getSelection(params.id);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ogpImageUrl = `${baseUrl}/api/ogp/${params.id}`;

  return {
    title: selection.title,
    description: `${selection.title} - 名刺代わりのAV10選メーカー`,
    openGraph: {
      title: selection.title,
      description: `${selection.title} - 名刺代わりのAV10選メーカー`,
      images: [{
        url: ogpImageUrl,
        width: 1200,
        height: 630,
        alt: selection.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: selection.title,
      description: `${selection.title} - 名刺代わりのAV10選メーカー`,
      images: [ogpImageUrl],
    },
  };
}

export default async function SelectionPage({
  params,
}: {
  params: { id: string };
}) {
  const items = (await getSelectionItems(params.id));
  const selection = (await getSelection(params.id));

  return (
    <main className="container mx-auto pb-8">
      <Link href="/" className="text-blue-500 text-5xl font-bold mb-6 block underline">
        ここから生成できます!
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-white">{selection.title}</h1>
      <div className="relative w-full mb-8">
        <h2 className="text-xl font-bold text-white mb-4">選択されたAV一覧</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {items.map((item) => (
              <div
                key={item.package_id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 min-w-[280px] max-w-[280px]"
              >
                <Link href={item.fanza_url} className="aspect-w-16 aspect-h-9 relative block">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full hover:opacity-90 transition-opacity duration-300"
                      width={1000}
                      height={1000}
                    />
                  </div>
                </Link>
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-bold text-white line-clamp-2">
                    {item.package_title}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  {item.comment && (
                    <p className="text-pink-400 text-sm italic border-l-4 border-pink-500 pl-3 line-clamp-2">
                      {item.comment}
                    </p>
                  )}
                  <div className="flex flex-col space-y-2 mt-4">
                    <a
                      href={item.fanza_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-center text-sm"
                    >
                      FANZAで見る →
                    </a>
                    {item.sample_movie_url && (
                      <a
                        href={item.sample_movie_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition-colors duration-300 text-center text-sm"
                      >
                        サンプル動画を見る →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
