import dynamic from "next/dynamic";
import { getPackages, getRecentSelections } from "./actions";

export default async function Home() {
  // サーバーサイドでパッケージ情報を取得し、ログに出力（UIは変更しません）
  const packages = await getPackages();
  console.log("Retrieved packages:", packages);

  const AVSelector = dynamic(() => import("../../av-selector"), {
    ssr: false,
  });

  const recentSelections = await getRecentSelections();

  return <AVSelector initialRecentSelections={recentSelections.map(selection => ({
    ...selection,
    created_at: selection.created_at.toISOString()
  }))} />;
}
