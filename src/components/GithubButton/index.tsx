"use client";

import { Github } from "lucide-react";
import React from "react";
import { loginGithub } from "./action";

export default function GithubButton() {
  return (
    <button
      onClick={async () => await loginGithub()}
      className="flex w-full bg-slate-100/10 text-slate-400 py-2 px-4 rounded-lg items-center justify-center gap-4"
    >
      <Github className="w-5 aspect-square stroke-[3px]" />
      <span className="font-bold">Login with github</span>
    </button>
  );
}
