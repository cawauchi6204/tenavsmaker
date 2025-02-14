import { createCanvas, loadImage } from "canvas";
import { getSelectionItems, getSelection } from "@/app/actions";
import { NextResponse } from "next/server";

const WIDTH = 1200;
const HEIGHT = 630;
const GRID_COLS = 3;
const GRID_ROWS = 4;
const PADDING = 20;
const TITLE_HEIGHT = 60;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const items = await getSelectionItems(params.id);
    const selection = await getSelection(params.id);

    // Create canvas
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    // Set background
    ctx.fillStyle = "#ffa31a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px";
    ctx.textAlign = "center";
    ctx.fillText(selection.title, WIDTH / 2, TITLE_HEIGHT);

    // Calculate image dimensions
    const imageWidth = (WIDTH - (GRID_COLS + 1) * PADDING) / GRID_COLS;
    const imageHeight =
      (HEIGHT - TITLE_HEIGHT - (GRID_ROWS + 1) * PADDING) / GRID_ROWS;

    // Load and draw images
    await Promise.all(
      items.slice(0, GRID_COLS * GRID_ROWS).map(async (item, index) => {
        try {
          const image = await loadImage(item.image_url);
          const row = Math.floor(index / GRID_COLS);
          const col = index % GRID_COLS;
          const x = PADDING + col * (imageWidth + PADDING);
          const y = TITLE_HEIGHT + PADDING + row * (imageHeight + PADDING);

          // Draw image
          ctx.drawImage(image, x, y, imageWidth, imageHeight);
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