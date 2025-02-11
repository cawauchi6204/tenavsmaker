import { neon } from "@neondatabase/serverless";

// Neon の接続設定
const sql = neon(process.env.DATABASE_URL as string);

export async function seed() {
  // パッケージテーブルにサンプルデータを挿入
  await sql`
    INSERT INTO packages (id, title, image_url, fanza_url, description)
    VALUES
      ('AV001', 'タイトルサンプル1', 'https://example.com/image1.jpg', 'https://example.com/fanza1', 'これはサンプル説明文1です。'),
      ('AV002', 'タイトルサンプル2', 'https://example.com/image2.jpg', 'https://example.com/fanza2', 'これはサンプル説明文2です。')
    ON CONFLICT (id) DO NOTHING;
  `;

  // セレクションテーブルにサンプルデータを挿入
  const [selection] = await sql`
    INSERT INTO selections (id, title, description)
    VALUES (gen_random_uuid(), 'サンプル名刺代わりのAV10選', 'これはサンプルのセレクションです。')
    RETURNING *;
  `;

  // セレクションアイテムテーブルにサンプルデータを挿入
  await sql`
    INSERT INTO selection_items (selection_id, package_id, item_order, comment)
    VALUES
      (${selection.id}, 'AV001', 1, 'サンプルコメント1'),
      (${selection.id}, 'AV002', 2, 'サンプルコメント2')
    ON CONFLICT DO NOTHING;
  `;

  console.log("Database seeding completed.");
}