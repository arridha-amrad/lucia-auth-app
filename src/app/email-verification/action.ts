"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { actionClient, ServerError } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const verify = actionClient
  .schema(
    zfd.formData({
      code: zfd.text(z.string()),
    })
  )
  .action(async ({ parsedInput: { code } }) => {
    const registerId = cookies().get("registerId")?.value;
    if (!registerId) {
      redirect("/register");
    }
    try {
      const user = await prisma.user.findFirst({
        where: { id: registerId },
      });
      if (!user) {
        throw new ServerError("Unrecogzied session");
      }
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
        throw new ServerError("Invalid code");
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
      cookies().delete({ name: "registerId" });
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      redirect("/");
    } catch (err) {
      throw err;
    }
  });
