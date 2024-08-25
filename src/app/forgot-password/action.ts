"use server";

import prisma from "@/db";
import { actionClient, ServerError } from "@/lib/safe-action";
import { generatePasswordResetToken } from "@/utils/generatePasswordResetToken";
import { initRateLimiter } from "@/utils/rateLimiter";
import { sendEmail } from "@/utils/sendEmail";
import { flattenValidationErrors } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const forgotPassword = actionClient
  .schema(
    zfd.formData({
      email: zfd.text(z.string().email()),
    }),
    {
      handleValidationErrorsShape: (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .action(async ({ parsedInput: { email } }) => {
    const ip = headers().get("x-forwarded-for");
    if (!ip) {
      throw new ServerError("Invalid request");
    }
    try {
      const { success } = await initRateLimiter(3, "1m").limit(ip);
      if (!success) {
        throw new ServerError("Too many request");
      }
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
        throw new ServerError("Email is not registered");
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

      return `An Email has been sent to ${email}. Please follow the instructions to reset your password`;
    } catch (err) {
      throw err;
    }
  });
