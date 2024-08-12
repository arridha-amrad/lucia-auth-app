import { validateRequest } from "@/auth";
import ButtonLogout from "@/ButtonLogout";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div>
      <div>{JSON.stringify(user)}</div>
      <ButtonLogout />
    </div>
  );
}
