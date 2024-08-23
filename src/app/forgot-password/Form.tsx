"use client";

import { ChangeEvent, useState } from "react";

export default function Form() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await fetch("/api/forgot-password", {
        body: JSON.stringify({ email }),
        method: "POST",
      });
      const data = await result.json();
      console.log(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
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
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 py-1 px-4"
        >
          {isLoading ? "Loading" : "Submit"}
        </button>
      </form>
    </div>
  );
}
