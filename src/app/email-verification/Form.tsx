"use client";

import React from "react";
import { useFormState } from "react-dom";
import { verifyEmailAction } from "./action";

const initialState = {
  error: "",
};

export default function Form() {
  const [state, action] = useFormState(verifyEmailAction, initialState);
  return (
    <div>
      {!!state.error && (
        <div className="bg-red-500/50 py-2 px-4">
          <p className="text-red-500">{state.error}</p>
        </div>
      )}
      <form action={action}>
        <input className="text-slate-900" type="text" name="code" />
        <button
          className="bg-blue-600 text-white rounded-lg py-2 px-4"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
