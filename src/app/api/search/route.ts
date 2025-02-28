import { NextResponse } from "next/server";
import { searchByTitle, searchByActress, searchByKeyword } from "@/lib/dmm-api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term");
    const type = searchParams.get("type");
    const hits = searchParams.get("hits")
      ? parseInt(searchParams.get("hits") as string)
      : 100;

    // 追加のオプションパラメータを取得
    const floor = searchParams.get("floor") || undefined;
    const sort = searchParams.get("sort") || undefined;
    const genre = searchParams.get("genre") || undefined;
    const maker = searchParams.get("maker") || undefined;
    const series = searchParams.get("series") || undefined;
    const director = searchParams.get("director") || undefined;

    if (!term) {
      return NextResponse.json(
        { error: "検索キーワードが必要です" },
        { status: 400 }
      );
    }

    try {
      let items;

      // 検索タイプに応じた関数を呼び出す
      if (type === "actress") {
        // 女優名での検索
        items = await searchByActress(term, hits);
      } else if (type === "keyword") {
        // 一般的なキーワード検索
        items = await searchByKeyword(term, hits, {
          floor,
          sort,
          genre,
          maker,
          series,
          director,
        });
      } else {
        // タイトルでの検索（デフォルト）
        items = await searchByTitle(term, hits);
      }

      // API からのレスポンスを確認
      if (!items || !Array.isArray(items)) {
        console.error("Invalid API response:", items);
        return NextResponse.json(
          { error: "API からの無効なレスポンス" },
          { status: 500 }
        );
      }

      // フロントエンドで使いやすい形式に変換
      const results = items.map((item) => ({
        id: item.content_id,
        title: item.title,
        image_url:
          item.imageURL?.large ||
          item.imageURL?.small ||
          item.imageURL?.list ||
          "",
        fanza_url: item.affiliateURL || item.URL || "",
        actress: item.iteminfo?.actress?.map((a) => a.name).join(", ") || "",
        maker: item.iteminfo?.maker?.map((m) => m.name).join(", ") || "",
        date: item.date || "",
        price: item.price || "",
        // 追加情報
        genres: item.iteminfo?.genre?.map((g) => g.name) || [],
        series: item.iteminfo?.series?.map((s) => s.name).join(", ") || "",
        director: item.iteminfo?.director?.map((d) => d.name).join(", ") || "",
      }));

      return NextResponse.json(results);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      return NextResponse.json(
        { error: "API リクエストに失敗しました" },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("検索に失敗しました:", error);
    let errorMessage = "不明なエラー";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
