"use server";

import prisma from "@/db";
import { generateEmailVerificationCode } from "@/utils/generateVerificationCode";
import { sendEmail } from "@/utils/sendEmail";
import { hash } from "@node-rs/argon2";

export const register = async (_: any, formData: FormData) => {
  "use server";
  const rawFormData = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const isEmailRegistered = await prisma.user.findFirst({
    where: {
      email: rawFormData.email,
    },
  });

  if (isEmailRegistered) {
    return {
      message: "Email has been registered",
      type: "error",
    };
  }

  const isUsernameRegistered = await prisma.user.findFirst({
    where: {
      username: rawFormData.username,
    },
  });

  if (isUsernameRegistered) {
    return {
      message: "Username has been registered",
      type: "error",
    };
  }
  const hashedPassword = await hash(rawFormData.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const newUser = await prisma.user.create({
    data: {
      email: rawFormData.email,
      username: rawFormData.username,
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

  return {
    message: "Please check your email",
    type: "success",
  };
};
