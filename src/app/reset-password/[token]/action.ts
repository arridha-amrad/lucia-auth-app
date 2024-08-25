"use server";

import prisma from "@/db";
import { actionClient, ServerError } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { isWithinExpirationDate } from "oslo";
import { lucia } from "@/auth";
import { hash } from "@node-rs/argon2";

export const resetPassword = actionClient
  .schema(
    zfd.formData({
      password: zfd.text(z.string()),
    }),
    {
      handleValidationErrorsShape: (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    }
  )
  .bindArgsSchemas<[token: z.ZodString]>([z.string()])
  .action(
    async ({ parsedInput: { password }, bindArgsParsedInputs: [token] }) => {
      try {
        const tokenHash = encodeHex(
          await sha256(new TextEncoder().encode(token))
        );
        const storedToken = await prisma.passwordResetToken.findFirst({
          where: {
            tokenHash,
          },
        });
        if (!storedToken) {
          throw new ServerError("Invalid token");
        }
        if (!isWithinExpirationDate(storedToken.expiresAt)) {
          throw new ServerError("Expired token");
        }
        await lucia.invalidateUserSessions(storedToken.userId);
        const passwordHash = await hash(password, {
          // recommended minimum parameters
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        });
        await prisma.user.update({
          where: {
            id: storedToken.userId,
          },
          data: {
            passwordHash,
          },
        });
        return "Your password has sucessfully updated";
      } catch (err) {
        throw err;
      }
    }
  );
