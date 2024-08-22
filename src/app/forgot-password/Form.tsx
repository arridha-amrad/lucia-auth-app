"use client";

import { ChangeEvent, useState } from "react";

export default function Form() {
  const [email, setEmail] = useState("");

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await fetch("/api/forgot-password", {
      body: JSON.stringify({ email }),
      method: "POST",
    });
    const data = await result.json();

    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2" action="">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          className="py-2 px-4 bg-slate-700"
          type="text"
          name="email"
        />
        <button type="submit" className="bg-blue-500 py-1 px-4">
          Submit
        </button>
      </form>
    </div>
  );
}
