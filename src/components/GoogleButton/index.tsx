"use client";

import React from "react";
import { loginGoogle } from "./action";

export default function GoogleButton() {
  return (
    <button
      onClick={async () => await loginGoogle()}
      className="flex w-full bg-slate-100/10 text-slate-400 py-2 px-4 rounded-lg items-center justify-center gap-4"
    >
      <span className="font-bold">Login with google</span>
    </button>
  );
}
