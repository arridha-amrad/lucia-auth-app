"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { generateEmailVerificationCode } from "@/utils/generateVerificationCode";
import { sendEmail } from "@/utils/sendEmail";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const register = async (_: any, formData: FormData) => {
  const rawFormData = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  try {
    const isEmailRegistered = await prisma.user.findFirst({
      where: {
        email: rawFormData.email,
      },
    });

    if (isEmailRegistered) {
      return {
        error: "Email has been registered",
      };
    }

    const isUsernameRegistered = await prisma.user.findFirst({
      where: {
        username: rawFormData.username,
      },
    });

    if (isUsernameRegistered) {
      return {
        error: "Username has been registered",
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

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect("/email-verification");
  } catch (err) {
    console.log(err);
    return {
      error: "Something went wrong",
    };
  }
};
