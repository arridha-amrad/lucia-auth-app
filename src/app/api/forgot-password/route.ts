import prisma from "@/db";
import { generatePasswordResetToken } from "@/utils/generatePasswordResetToken";
import { sendEmail } from "@/utils/sendEmail";
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

export const POST = async (request: NextRequest) => {
  const ip = headers().get("x-forwarded-for");

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

  const { email } = await request.json();

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { message: "Email is not registered" },
      { status: 404 }
    );
  }

  const verificationToken = await generatePasswordResetToken(user.id);
  const verificationLink =
    "http://localhost:3000/reset-password/" + verificationToken;

  const html = `
  <div>
    <p>Please follow this link to reset your password</p>
    <a href=${verificationLink}>Click here</a>
  </div>
  `;

  await sendEmail({
    toEmail: email,
    subject: "Reset Password Request",
    html,
  });

  return NextResponse.json(
    {
      message: "Hello, World!",
    },
    {
      status: 200,
    }
  );
};
