"use client";

import { register } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function FormRegister() {
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const { execute, isExecuting } = useAction(register, {
    onError: ({ error: { validationErrors, serverError } }) => {
      if (validationErrors) {
        const { email, password, username } = validationErrors;
        setError({
          ...error,
          email: email ? email[0] : "",
          username: username ? username[0] : "",
          password: password ? password[0] : "",
        });
      }
      if (serverError) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
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
        <p className="text-sm text-red-500">{error.username}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
        <p className="text-sm text-red-500">{error.email}</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
        <p className="text-sm text-red-500">{error.password}</p>
      </div>
      <Button
        disabled={isExecuting}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isExecuting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
        Register
      </Button>
    </form>
  );
}
