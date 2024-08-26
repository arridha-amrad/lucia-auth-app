"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function ServerMessage() {
  const q = useSearchParams();
  const message = q.get("message");
  return message ? (
    <div className="text-destructive bg-destructive/20 p-4 rounded-lg">
      {message}
    </div>
  ) : null;
}
