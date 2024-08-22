"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (_: any, formData: FormData) => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    redirect("/register");
  }

  const { user } = await lucia.validateSession(sessionId);
  if (!user) {
    return {
      error: "No user on current session",
    };
  }

  const code = formData.get("code") as string;

  const validCode = await prisma.emailVerificationCode.findFirst({
    where: {
      AND: [
        {
          userId: user.id,
        },
        {
          code,
        },
      ],
    },
  });

  if (!validCode) {
    return {
      error: "Invalid code",
    };
  }

  await prisma.emailVerificationCode.delete({
    where: {
      id: validCode.id,
    },
  });

  await lucia.invalidateUserSessions(user.id);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
};
