import AVSelector from "../av-selector";
import { getRecentSelections } from "@/app/actions";
import dayjs from "dayjs";

export default async function Home() {
  const recentSelections = await getRecentSelections();

  // Date オブジェクトを dayjs を使って ISO 文字列に変換
  const serializedSelections = recentSelections.map((selection) => ({
    ...selection,
    created_at: dayjs(selection.created_at).format()
  }));
  console.log("🚀 ~ serializedSelections ~ serializedSelections:", serializedSelections)

  return <AVSelector initialRecentSelections={serializedSelections} />;
}
