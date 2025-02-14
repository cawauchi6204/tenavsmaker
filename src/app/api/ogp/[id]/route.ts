import { createCanvas, loadImage, registerFont } from "canvas";
import { getSelectionItems, getSelection } from "@/app/actions";
import { NextResponse } from "next/server";

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 20;
const TITLE_HEIGHT = 60;

// グリッドレイアウトを計算する関数を追加
function calculateGrid(itemCount: number) {
  if (itemCount <= 1) return { cols: 1, rows: 1 };
  if (itemCount <= 2) return { cols: 2, rows: 1 };
  if (itemCount <= 4) return { cols: 2, rows: 2 };
  if (itemCount <= 6) return { cols: 3, rows: 2 };
  if (itemCount <= 9) return { cols: 3, rows: 3 };
  return { cols: 3, rows: 4 }; // 最大12個まで
}

// フォントの登録を追加
registerFont("./fonts/NotoSansJP-Bold.ttf", { family: "Noto Sans JP" });

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const items = await getSelectionItems(params.id);
    const selection = await getSelection(params.id);

    // データの存在確認をより厳密に
    if (!items || items.length === 0 || !Array.isArray(items)) {
      console.error("Invalid items:", { items });
      return new NextResponse("Invalid items", { status: 404 });
    }

    if (!selection?.title?.trim()) {
      console.error("Invalid selection or title:", { selection });
      return new NextResponse("Invalid selection", { status: 404 });
    }

    // 画像URLの事前検証
    const validItems = items.filter(item => item && typeof item.image_url === 'string' && item.image_url.trim());
    if (validItems.length === 0) {
      console.error("No valid image URLs found");
      return new NextResponse("No valid images", { status: 400 });
    }

    // グリッドサイズを計算
    const { cols: GRID_COLS, rows: GRID_ROWS } = calculateGrid(items.length);

    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // Set background
    ctx.fillStyle = "#ffa31a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px 'Noto Sans JP'";
    ctx.textAlign = "center";
    ctx.fillText(selection.title, WIDTH / 2, TITLE_HEIGHT);

    // Calculate image dimensions
    const imageWidth = (WIDTH - (GRID_COLS + 1) * PADDING) / GRID_COLS;
    const imageHeight =
      (HEIGHT - TITLE_HEIGHT - (GRID_ROWS + 1) * PADDING) / GRID_ROWS;

    // Load and draw images
    await Promise.all(
      validItems.map(async (item, index) => {
        try {
          const image = await loadImage(item.image_url);
          const row = Math.floor(index / GRID_COLS);
          const col = index % GRID_COLS;
          const x = PADDING + col * (imageWidth + PADDING);
          const y = TITLE_HEIGHT + PADDING + row * (imageHeight + PADDING);

          // 画像をアスペクト比を保持しながら描画
          const aspectRatio = image.width / image.height;
          let drawWidth = imageWidth;
          let drawHeight = imageHeight;
          let drawX = x;
          let drawY = y;

          if (aspectRatio > imageWidth / imageHeight) {
            // 横長の画像
            drawHeight = drawWidth / aspectRatio;
            drawY = y + (imageHeight - drawHeight) / 2;
          } else {
            // 縦長の画像
            drawWidth = drawHeight * aspectRatio;
            drawX = x + (imageWidth - drawWidth) / 2;
          }

          ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
          console.log(`Successfully drew image ${index}`); // デバッグログ
        } catch (error) {
          console.error(`Error loading image ${index}:`, error);
          // エラー発生時もプロミスを解決する
          return null;
        }
      })
    ).catch(error => {
      console.error("Error in Promise.all:", error);
      throw error;
    });

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    console.log("OGP image generated successfully"); // デバッグログ
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OGP image:", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}