"use client";

import React from "react";
import { useFormState } from "react-dom";
import { login } from "./action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
      </div>
      <Button className="uppercase font-extrabold" type="submit">
        Login
      </Button>
    </form>
  );
}
