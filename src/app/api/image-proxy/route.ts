
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=31536000, immutable"); // Cache aggressively

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.warn(`[Image Proxy] Error fetching ${url}:`, error.message);
    
    // Handle specific network errors gracefully
    if (error.code === 'ENOTFOUND' || error.cause?.code === 'ENOTFOUND') {
        return new NextResponse("Image host not found (DNS Error)", { status: 404 });
    }
    if (error.code === 'ETIMEDOUT' || error.cause?.code === 'ETIMEDOUT') {
        return new NextResponse("Image fetch timed out", { status: 504 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
