import { notFound } from "next/navigation";
import Link from "next/link";
import { videoData } from "@/lib/video-data";

export default function VideoDetailPage({ params }: { params: { id: string } }) {
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

          <div className="flex flex-col md:flex-row gap-6">
            {/* サムネイル画像 */}
            <div className="md:w-1/3">
              <div className="bg-gray-200 aspect-[3/4] rounded-md flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">サンプル画像</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 aspect-square rounded-sm flex items-center justify-center"
                  >
                    <span className="text-gray-500 text-xs">画像{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 動画情報 */}
            <div className="md:w-2/3">
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
        </div>

        {/* サンプル動画 */}
        <div className="mb-8">
          <h2 className="font-bold text-xl mb-4">サンプル動画</h2>
          <div className="bg-gray-200 aspect-video rounded-md flex items-center justify-center">
            <span className="text-gray-500">サンプル動画はありません</span>
          </div>
        </div>

        {/* 関連作品 */}
        <div className="mb-8">
          <h2 className="font-bold text-xl mb-4">関連作品</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videoData
              .filter((v) => v.id !== video.id && v.actress.includes("藤野つかさ"))
              .slice(0, 4)
              .map((relatedVideo, index) => (
                <Link
                  href={`/${relatedVideo.id}`}
                  key={index}
                  className="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-200 aspect-[3/4] rounded-md mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">サンプル画像</span>
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2">
                    {relatedVideo.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {relatedVideo.actress}
                  </p>
                </Link>
              ))}
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center border-t pt-4 mt-8">
          <p>© エロ娘の館.</p>
        </footer>
      </main>
    </div>
  );
}
