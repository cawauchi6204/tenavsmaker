import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const type = searchParams.get('type');

    if (!term) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 });
    }

    let query;
    if (type === 'title') {
      query = sql`
        SELECT id, title, image_url, fanza_url
        FROM packages
        WHERE title ILIKE ${`%${term}%`}
        ORDER BY created_at DESC
        LIMIT 10;
      `;
    } else {
      // 女優名での検索(今回は title で代用)
      query = sql`
        SELECT id, title, image_url, fanza_url
        FROM packages
        WHERE title ILIKE ${`%${term}%`}
        ORDER BY created_at DESC
        LIMIT 10;
      `;
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Search failed:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}