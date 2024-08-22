import { NextRequest, NextResponse } from "next/server";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

export const POST = async (req: NextRequest) => {
  const { password, token } = await req.json();

  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));

  console.log({ tokenHash });

  return NextResponse.json(
    { message: "ok" },
    {
      status: 302,
      headers: {
        Location: "/",
        "Referrer-Policy": "strict-origin",
      },
    }
  );
};
