"use client";

import React, { ChangeEvent, useState } from "react";

export default function Form() {
  const [password, setPassword] = useState("");
  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <input
          type="text"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 py-1 px-4">
          Submit
        </button>
      </form>
    </div>
  );
}
