import { TimeSpan, createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/db";

export async function generatePasswordResetToken(
  userId: string
): Promise<string> {
  await prisma.passwordResetToken.delete({
    where: {
      userId,
    },
  });

  const tokenId = generateIdFromEntropySize(25); // 40 character
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h")),
    },
  });

  return tokenId;
}
