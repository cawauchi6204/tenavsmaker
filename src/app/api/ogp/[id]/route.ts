import { createCanvas, loadImage } from "canvas";
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const items = await getSelectionItems(params.id);
    const selection = await getSelection(params.id);

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
    ctx.font = "bold 40px sans-serif"; // フォントファミリーを追加
    ctx.textAlign = "center";
    ctx.fillText(selection.title, WIDTH / 2, TITLE_HEIGHT);

    // Calculate image dimensions
    const imageWidth = (WIDTH - (GRID_COLS + 1) * PADDING) / GRID_COLS;
    const imageHeight =
      (HEIGHT - TITLE_HEIGHT - (GRID_ROWS + 1) * PADDING) / GRID_ROWS;

    // Load and draw images
    await Promise.all(
      items.map(async (item, index) => {
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
        } catch (error) {
          console.error(`Error loading image ${index}:`, error);
        }
      })
    );

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Return the image
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OGP image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}