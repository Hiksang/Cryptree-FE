import { NextResponse } from "next/server";
import { getAuthUserId } from "@/core/auth";
import { db } from "@/core/db";
import { feedbacks } from "@/core/db/schema";

export async function POST(request: Request) {
  const userId = await getAuthUserId().catch(() => null);

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { category, message, email, page } = body as {
    category?: string;
    message?: string;
    email?: string;
    page?: string;
  };

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.length > 1000) {
    return NextResponse.json(
      { error: "Message must be 1000 characters or less" },
      { status: 400 },
    );
  }

  const validCategories = ["bug", "feature", "general"];
  const cat = validCategories.includes(category ?? "")
    ? category!
    : "general";

  const [feedback] = await db
    .insert(feedbacks)
    .values({
      userId: userId ?? null,
      email: email?.trim() || null,
      category: cat,
      message: message.trim(),
      page: page || null,
    })
    .returning();

  return NextResponse.json(feedback, { status: 201 });
}
