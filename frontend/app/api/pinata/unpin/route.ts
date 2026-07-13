import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cid } = await req.json();

    if (!cid) {
      return NextResponse.json({ error: "No CID provided" }, { status: 400 });
    }

    const res = await fetch(`https://api.pinata.cloud/pinning/unpin/${cid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}` },
    });

    if (!res.ok) {
      const details = await res.text();
      return NextResponse.json({ success: false, error: details }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Unpin error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to unpin" },
      { status: 500 }
    );
  }
}