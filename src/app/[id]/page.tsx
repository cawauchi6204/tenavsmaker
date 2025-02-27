import { notFound } from "next/navigation";
import Link from "next/link";
import { videoData } from "@/lib/video-data";

export default function VideoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // IDに基づいて動画データを検索
  const video = videoData.find((v) => v.id === params.id);

  // 動画が見つからない場合は404ページを表示
  if (!video) {
    notFound();
  }

  // レビュー星表示用の関数
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (hasHalfStar) {
      stars.push("☆");
    }

    return stars.join("");
  };

  return (
    <div className="bg-white min-h-screen">
      <main className="container mx-auto p-4">
        {/* サブメニュー */}
        <div className="flex justify-center mb-8">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                • トップページ
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                • 動画
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                • プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                • お問い合わせ
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:underline">
                • 運営者情報
              </Link>
            </li>
          </ul>
        </div>

        {/* パンくずリスト */}
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:underline">
            トップ
          </Link>{" "}
          &gt;{" "}
          <Link href="/" className="hover:underline">
            動画一覧
          </Link>{" "}
          &gt; {video.title}
        </div>

        {/* 動画詳細 */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

          <div className="flex flex-col gap-6">
            {/* サムネイル画像 */}
            <div className="mt-4 flex flex-col gap-2">
              {video.imageUrls.map((url, i) => {
                if (i !== 0) {
                  return <></>;
                }
                return (
                  <div
                    key={i}
                    className="bg-gray-200 aspect-[3/2] rounded-sm flex items-center justify-center overflow-hidden relative"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center"></div>
                  </div>
                );
              })}
            </div>
            {/* 動画情報 */}
            <div>
              <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-xl mr-2">
                    {renderStars(video.review)}
                  </span>
                  <span className="text-lg font-bold">{video.review}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">品番:</span> {video.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">出演者:</span>{" "}
                      {video.actress}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">メーカー:</span>{" "}
                      {video.maker}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">レーベル:</span>{" "}
                      {video.label || "---"}
                    </p>
                    {video.series && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">シリーズ:</span>{" "}
                        {video.series}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">発売日:</span>{" "}
                      {video.releaseDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">収録時間:</span>{" "}
                      {video.duration}分
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">監督:</span>{" "}
                      {video.director || "---"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">価格:</span> {video.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">画質:</span>{" "}
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {video.quality}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 商品説明 */}
              <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                <h2 className="font-bold text-lg mb-2">商品説明</h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {video.description}
                </p>
              </div>

              {/* 価格確認ボタン */}
              <a
                href={`https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-red-600 text-white text-center py-4 rounded-md font-medium mb-4 hover:bg-red-700 transition-colors"
              >
                この作品の価格を確認
              </a>

              {/* ジャンル */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h2 className="font-bold text-lg mb-2">ジャンル</h2>
                <div className="flex flex-wrap gap-2">
                  {video.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-4 flex flex-col gap-2">
              {video.imageUrls.map((url, i) => {
                if (i === 0) {
                  return <></>;
                }
                return (
                  <div
                    key={i}
                    className="bg-gray-200 aspect-[3/2] rounded-sm flex items-center justify-center overflow-hidden relative"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center"></div>
                  </div>
                );
              })}
              {/* 価格確認ボタン */}
              <a
                href={`https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-red-600 text-white text-center py-4 rounded-md font-medium mb-4 hover:bg-red-700 transition-colors"
              >
                この作品の価格を確認
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
