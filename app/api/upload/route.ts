import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { image } = await req.json();
  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const url = await uploadImage(image, "treyfa/products");
  return NextResponse.json({ url });
}
