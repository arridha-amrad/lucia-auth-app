"use client";

import React from "react";
import { useFormState } from "react-dom";
import { register } from "./action";

const initialState = {
  message: "",
  type: "error" || "success",
};

export default function FormRegister() {
  const [state, action] = useFormState(register, initialState);
  return (
    <form action={action} className="flex flex-col gap-3">
      {state.type === "error" && (
        <div className="bg-red-500/50 text-red-500 px-4 py-2">
          {state.message}
        </div>
      )}
      {state.type === "success" && (
        <div className="bg-green-500/50 text-green-500 px-4 py-2">
          {state.message}
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
        <label htmlFor="email">Email</label>
        <input
          className="bg-slate-700 text-slate-200 px-4 py-2"
          type="text"
          id="email"
          name="email"
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
        Register
      </button>
    </form>
  );
}
