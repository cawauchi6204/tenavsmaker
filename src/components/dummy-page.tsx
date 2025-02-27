import Link from "next/link";
import { videoData } from "@/lib/video-data";

export default function DummyPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* メインコンテンツ */}
      <main className="container mx-auto p-4">
        <div className="text-center my-8">
          <p className="text-lg">エッチな娘と楽しもう</p>
        </div>

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

        {/* 動画一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {videoData.map((video, i) => (
            <div key={i} className="mb-6">
              <div className="relative">
                <Link href={`/${video.id}`}>
                  <div className="aspect-[4/3] bg-gray-200 rounded-md overflow-hidden relative">
                    {video.imageUrls.length > 0 ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${video.imageUrls[0]})`,
                        }}
                      ></div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-500 text-sm">
                          サンプル画像
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      動画
                    </div>
                  </div>
                </Link>
              </div>

              <div className="mt-2">
                <h3 className="text-sm font-medium">
                  <Link href={`/${video.id}`} className="hover:underline">
                    {video.id} 【{video.quality}】{video.title} {video.actress}
                  </Link>
                </h3>
                <div className="text-xs text-gray-600 mt-1">
                  <a
                    href={`https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    この作品の価格を確認
                  </a>{" "}
                  <a
                    href={`https://www.dmm.co.jp/digital/videoa/-/detail/=/cid=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    この作品の価格を確認
                  </a>{" "}
                  レビュー {video.review}発売日{video.releaseDate}収録
                  {video.duration}分 ジャンル
                  {video.genres.slice(0, 5).join(" ")}...
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  February 25, 2025
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        <div className="text-center mb-8">
          <p>123...184</p>
        </div>

        {/* フッター */}
        <footer className="text-center border-t pt-4 mt-8">
          <p>© エロ娘の館.</p>
        </footer>
      </main>
    </div>
  );
}
