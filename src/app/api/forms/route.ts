import { NextResponse } from "next/server";
import { validateSubmission } from "@/lib/forms";
import { sendFormEmail } from "@/lib/mail";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// ponytail: in-memory rate limit, so it is per serverless instance and resets
// on redeploy. Enough to stop casual form spam alongside the honeypot; move to
// Vercel KV / Upstash if real abuse shows up.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.set(ip, [...recent, now]);
  return recent.length >= MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const result = validateSubmission(body);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await sendFormEmail(result.data);
  } catch (error) {
    console.error("Form submission failed", error);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again or email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
