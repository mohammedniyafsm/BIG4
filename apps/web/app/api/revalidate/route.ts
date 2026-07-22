import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-revalidate-secret");
    
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }
    
    const body = await req.json();
    const tags: string[] = body.tags;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ message: "Missing or invalid tags array" }, { status: 400 });
    }

    tags.forEach((tag) => {
      (revalidateTag as any)(tag);
    });

    return NextResponse.json({ revalidated: true, now: Date.now(), tags });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
