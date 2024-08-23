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
          title: "Something went wrong",
          description: serverError,
        });
      }
    },
    onSuccess: ({ data }) => {
      toast({
        title: "Email verification is required",
        description: "An email with verification code has been sent to",
      });
    },
  });
  return (
    <form action={execute} className="flex flex-col gap-3">
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input type="text" id="username" name="username" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" />
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
