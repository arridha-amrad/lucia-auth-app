import React from "react";
import { lucia, validateRequest } from "./auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ButtonLogout() {
  async function logout() {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
      redirect("/login");
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    cookies().delete("state");
    cookies().delete("codeVerifier");
    return redirect("/login");
  }

  return (
    <form action={logout}>
      <button className="bg-orange-500 text-white py-2 px-4" type="submit">
        Logout
      </button>
    </form>
  );
}
