import { NextResponse } from "next/server";
// import { seed } from "@/app/seed";

export async function GET() {
  try {
    // await seed();
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error: unknown) {
    console.error("Seeding failed:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}