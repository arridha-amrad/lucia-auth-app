"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(_: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  console.log(user);

  if (!user) {
    return {
      error: "user not found",
    };
  }

  if (!user.emailVerified) {
    return {
      error: "Please verify your email",
    };
  }

  const isMatch = await verify(user.passwordHash, password);
  if (!isMatch) {
    return {
      error: "Invalid password",
    };
  }
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}
