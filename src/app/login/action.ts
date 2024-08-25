"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { actionClient, ServerError } from "@/lib/safe-action";
import { verify } from "@node-rs/argon2";
import { flattenValidationErrors } from "next-safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const login = actionClient
  .schema(
    zfd.formData({
      username: zfd.text(z.string()),
      password: zfd.text(z.string()),
    }),
    {
      handleValidationErrorsShape: (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .action(async ({ parsedInput: { password, username } }) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) {
        throw new ServerError("User not found");
      }

      if (!user.emailVerified) {
        throw new ServerError("Please verify your email first");
      }

      const isMatch = await verify(user.passwordHash, password);
      if (!isMatch) {
        throw new ServerError("Invalid password");
      }
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
