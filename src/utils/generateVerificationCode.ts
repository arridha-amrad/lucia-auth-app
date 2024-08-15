import prisma from "@/db";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
): Promise<string> => {
  await prisma.emailVerificationCode.deleteMany({
    where: {
      userId,
    },
  });

  const code = generateRandomString(8, alphabet("0-9"));
  await prisma.emailVerificationCode.create({
    data: {
      code,
      email,
      expiresAt: createDate(new TimeSpan(15, "m")),
      userId,
    },
  });

  return code;
};
