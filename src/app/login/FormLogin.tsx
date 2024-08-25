"use client";

import React, { useState } from "react";
import { login } from "./action";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function FormLogin() {
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();
  const { execute, isExecuting } = useAction(login, {
    onError: ({ error: { serverError, validationErrors } }) => {
      if (validationErrors) {
        const { password, username } = validationErrors;
        setError({
          ...error,
          password: password ? password[0] : "",
          username: username ? username[0] : "",
        });
      }
      if (serverError) {
        toast({
          title: "Server Error",
          description: serverError,
        });
      }
    },
  });

  return (
    <form action={execute} className="flex flex-col gap-3">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" />
        <p className="text-destructive text-sm">{error.username}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
        <p className="text-destructive text-sm">{error.password}</p>
      </div>
      <Button
        disabled={isExecuting}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isExecuting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
        Login
      </Button>
    </form>
  );
}
