import { NextResponse } from "next/server";
import { validateSubmission } from "@/lib/forms";
import { sendFormEmail } from "@/lib/mail";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const TURNSTILE_VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TOKEN_LIMIT = 2000;

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

/** "Have Your Say" is public and anonymous, so it draws more bot traffic than
 * the other (named, purposeful) forms — verify a Turnstile token on top of
 * the honeypot + rate limit every form already gets. */
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not configured.");

  const response = await fetch(TURNSTILE_VERIFY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });

  const result = await response.json().catch(() => ({ success: false }));
  return result.success === true;
}

export async function POST(request: Request) {
  // CF-Connecting-IP is set by Cloudflare's edge and can't be spoofed by the
  // client; x-forwarded-for can carry attacker-supplied entries, so it's
  // only a fallback for environments without Cloudflare in front (e.g. local
  // dev).
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

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

  if (result.data.kind === "feedback") {
    const token =
      body && typeof body === "object" && "turnstileToken" in body
        ? String((body as Record<string, unknown>).turnstileToken ?? "").slice(0, TURNSTILE_TOKEN_LIMIT)
        : "";

    if (!token || !(await verifyTurnstile(token, ip))) {
      return NextResponse.json(
        { error: "We couldn't verify you're human. Please try again." },
        { status: 400 },
      );
    }
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
