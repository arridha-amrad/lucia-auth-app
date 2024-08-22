import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Create a new rateLimit instance
const rateLimit = new Ratelimit({
  redis: kv, // Use Vercel KV for storage
  limiter: Ratelimit.slidingWindow(5, "1m"), // Limit to 5 requests per minute
});

// set the runtime to edge so that the function runs on the edge
export const runtime = "edge";

export const GET = async (request: NextRequest) => {
  const ip = headers().get("x-forwarded-for");

  console.log({ ip });

  if (!ip) {
    return NextResponse.json({ message: "Invalid request" }, { status: 429 });
  }

  const { success } = await rateLimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        message: "Too many request",
      },
      {
        status: 429,
      }
    );
  }

  return NextResponse.json(
    {
      message: "Hello, World!",
    },
    {
      status: 200,
    }
  );
};
