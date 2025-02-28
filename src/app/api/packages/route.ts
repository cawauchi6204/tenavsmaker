import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Neonの接続設定
const sql = neon(process.env.DATABASE_URL as string);

export async function POST(request: Request) {
  try {
    // リクエストボディからデータを取得
    const body = await request.json();
    const { id, title, image_url, fanza_url, description } = body;

    if (!id || !title || !image_url || !fanza_url) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // パッケージが既に存在するか確認
    const existingPackage = await sql`
      SELECT id FROM packages WHERE id = ${id}
    `;

    if (existingPackage.length > 0) {
      // 既に存在する場合は成功を返す（冪等性を保つ）
      return NextResponse.json({
        success: true,
        message: "パッケージは既に存在します",
        id,
      });
    }

    // 新しいパッケージを作成
    const [newPackage] = await sql`
      INSERT INTO packages (id, title, image_url, fanza_url, description)
      VALUES (${id}, ${title}, ${image_url}, ${fanza_url}, ${description})
      RETURNING *;
    `;

    // レスポンスを返す
    return NextResponse.json({
      success: true,
      package: newPackage,
    });
  } catch (error) {
    console.error("パッケージ作成エラー:", error);
    return NextResponse.json(
      { error: "パッケージの作成に失敗しました" },
      { status: 500 }
    );
  }
}
