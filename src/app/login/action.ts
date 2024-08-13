"use server";

import { lucia } from "@/auth";
import prisma from "@/db";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(_: any, formData: FormData) {
  "use server";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      error: "user not found",
    };
  }

  const isMatch = await verify(user.passwordHash, password);
  if (!isMatch) {
    return {
      error: "Invalid password",
    };
  }
  const session = await lucia.createSession(user.id, {
    country: "indonesia",
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
