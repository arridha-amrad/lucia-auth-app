"use client";

import React from "react";
import { useFormState } from "react-dom";
import { login } from "./action";

const initState = {
  error: "",
};

export default function FormLogin() {
  const [state, formAction] = useFormState(login, initState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {!!state.error && (
        <div className="text-red-500 bg-red-500/50 px-4 py-2">
          {state.error}
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="bg-slate-700 text-slate-200 px-4 py-2"
          id="username"
          name="username"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          className="bg-slate-700 text-slate-200 px-4 py-2"
          type="password"
          id="password"
          name="password"
        />
      </div>
      <button
        className="bg-blue-600 text-white rounded-lg py-2 px-4"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
