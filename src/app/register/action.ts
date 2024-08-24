"use server";

import prisma from "@/db";
import { actionClient, ServerError } from "@/lib/safe-action";
import { generateEmailVerificationCode } from "@/utils/generateVerificationCode";
import { sendEmail } from "@/utils/sendEmail";
import { hash } from "@node-rs/argon2";
import { flattenValidationErrors } from "next-safe-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const register = actionClient
  .schema(
    zfd.formData({
      email: zfd.text(z.string().email()),
      username: zfd.text(z.string()),
      password: zfd.text(z.string()),
    }),
    {
      handleValidationErrorsShape: (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .action(async ({ parsedInput: { email, password, username } }) => {
    try {
      const isEmailRegistered = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (isEmailRegistered) {
        throw new ServerError("Email has been registered");
      }

      const isUsernameRegistered = await prisma.user.findFirst({
        where: {
          username,
        },
      });

      if (isUsernameRegistered) {
        return {
          error: "Username has been registered",
        };
      }
      const hashedPassword = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          passwordHash: hashedPassword,
        },
      });

      const verificationCode = await generateEmailVerificationCode(
        newUser.id,
        newUser.email
      );

      const html = `
        <div>Hello ${newUser.username}</div>
        <p>This is your verification code : ${verificationCode}</p>
      `;

      await sendEmail({
        html,
        subject: "Email verification",
        toEmail: newUser.email,
      });

      cookies().set("registerId", newUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      redirect("/email-verification");
    } catch (err) {
      throw err;
    }
  });
