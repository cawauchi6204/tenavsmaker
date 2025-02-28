// src/app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

// Neonの接続設定
const sql = neon(process.env.DATABASE_URL as string);

interface Package {
  id: string;
  title: string;
  image_url: string;
  fanza_url: string;
  description: string;
  created_at: string;
  sample_movie_url: string;
}

interface Selection {
  id: string;
  title: string;
  description: string;
  created_at: Date;
}

/**
 * 全てのパッケージを取得します。
 * パッケージはAV候補（またはパッケージ）の情報です。
 */
export async function getPackages() {
  const result = await sql`
    SELECT id, title, image_url, fanza_url, description, created_at, sample_movie_url
    FROM packages
    ORDER BY created_at DESC;
  `;
  console.log("getPackages result:", result);
  return result as Package[];
}

/**
 * 新しいセレクション（名刺代わりのAV10選）を作成します。
 * PostgreSQLのpgcrypto拡張が有効な場合、gen_random_uuid()を使用してUUIDを生成します。
 * title, descriptionは任意で指定可能です。
 */
export async function createSelection({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const [selection] = await sql`
    INSERT INTO selections (id, title, description)
    VALUES (gen_random_uuid(), ${title ?? '名刺代わりのAV10選'}, ${description})
    RETURNING *;
  `;
  return selection;
}

/**
 * 指定されたセレクションに対して、選択されたパッケージ（AV候補）を追加します。
 * itemOrderは1～10の順序を表し、commentは任意のコメントです。
 */
export async function addSelectionItem({
  selectionId,
  packageId,
  itemOrder,
  comment,
}: {
  selectionId: string;
  packageId: string;
  itemOrder: number;
  comment?: string;
}) {
  const [selectionItem] = await sql`
    INSERT INTO selection_items (selection_id, package_id, item_order, comment)
    VALUES (${selectionId}, ${packageId}, ${itemOrder}, ${comment})
    RETURNING *;
  `;
  return selectionItem;
}

/**
 * 指定されたセレクションの全ての選択アイテムを取得します。
 * パッケージ情報もJOINして取得します。
 */
export async function getSelectionItems(selectionId: string) {
  // キャッシュを使用せずに常に最新のデータを取得
  const { revalidatePath } = await import('next/cache');
  
  // 選択肢の詳細ページのパスを再検証してキャッシュを無効化
  revalidatePath(`/selections/${selectionId}`);
  
  const items = await sql`
    SELECT si.*, p.title AS package_title, p.image_url, p.fanza_url, p.description, p.sample_movie_url
    FROM selection_items si
    JOIN packages p ON si.package_id = p.id
    WHERE si.selection_id = ${selectionId}
    ORDER BY si.item_order;
  `;
  return items;
}

export async function getSelection(selectionId: string) {
  // キャッシュを使用せずに常に最新のデータを取得
  const { revalidatePath } = await import('next/cache');
  
  // 選択肢の詳細ページのパスを再検証してキャッシュを無効化
  revalidatePath(`/selections/${selectionId}`);
  
  const selection = await sql`
    SELECT * FROM selections WHERE id = ${selectionId}
  `;
  return selection[0] as Selection;
}

export async function getRecentSelections() {
  // キャッシュを使用せずに常に最新のデータを取得
  const { revalidatePath } = await import('next/cache');
  
  // 現在のパスを再検証してキャッシュを無効化
  revalidatePath('/');
  
  const selections = await sql`
    SELECT * FROM selections
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  return selections as Selection[];
}

/**
 * 最近作成されたセレクションとそれに関連するAVパッケージを取得します。
 * 各セレクションごとに最大5つのパッケージを取得します。
 */
export async function getRecentSelectionsWithItems() {
  // キャッシュを使用せずに常に最新のデータを取得
  const { revalidatePath } = await import('next/cache');
  
  // 現在のパスを再検証してキャッシュを無効化
  revalidatePath('/');
  
  // 最近のセレクションを取得（最大10件）
  const selections = await sql`
    SELECT * FROM selections
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  
  // 各セレクションに関連するアイテムを取得
  const result = [];
  
  for (const selection of selections) {
    // 各セレクションに関連するアイテムを最大5つ取得
    const items = await sql`
      SELECT si.*, p.title AS package_title, p.image_url, p.fanza_url, p.description, p.sample_movie_url
      FROM selection_items si
      JOIN packages p ON si.package_id = p.id
      WHERE si.selection_id = ${selection.id}
      ORDER BY si.item_order
      LIMIT 5;
    `;
    
    // セレクションとそのアイテムをオブジェクトにまとめる
    result.push({
      selection,
      items
    });
  }
  
  return result;
}
