import dynamic from "next/dynamic";
import { getPackages } from "./actions";

export default async function Home() {
  // サーバーサイドでパッケージ情報を取得し、ログに出力（UIは変更しません）
  const packages = await getPackages();
  console.log("Retrieved packages:", packages);

  const BookSelector = dynamic(() => import("../../book-selector"), {
    ssr: false
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <BookSelector />
    </div>
  );
}
