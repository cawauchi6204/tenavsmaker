import { NextResponse } from "next/server";
import { createSelection, addSelectionItem } from "@/app/actions";

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { title, selectedAVs } = body;

    if (
      !selectedAVs ||
      !Array.isArray(selectedAVs) ||
      selectedAVs.length === 0
    ) {
      return NextResponse.json(
        { error: "選択されたAVが必要です" },
        { status: 400 }
      );
    }

    // 新しいセレクションを作成
    const selection = await createSelection({
      title: title || "名刺代わりのAV",
    });

    // 各AVをセレクションアイテムとして追加
    const selectionItems = await Promise.all(
      selectedAVs.map(async (av, index) => {
        // packageIdがある場合はそれを使用し、なければAVのIDを文字列に変換
        const packageId = av.packageId || av.id.toString();

        return await addSelectionItem({
          selectionId: selection.id,
          packageId: packageId,
          itemOrder: index + 1, // 1から始まる順序
          comment: av.comment, // コメントがあれば追加
        });
      })
    );

    // レスポンスを返す
    return NextResponse.json({
      success: true,
      selection,
      selectionItems,
    });
  } catch (error) {
    console.error("セレクション作成エラー:", error);
    return NextResponse.json(
      { error: "セレクションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
