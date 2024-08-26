"use server";

import { github } from "@/lib/github.init";
import { actionClient } from "@/lib/safe-action";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const loginGithub = actionClient.action(async ({}) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  redirect(url.toString());
});
