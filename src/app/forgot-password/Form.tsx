"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { forgotPassword } from "./action";
import { useToast } from "@/components/ui/use-toast";

export default function Form() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(forgotPassword, {
    onSuccess: ({ data }) => {
      if (!data) return;
      setMessage(data);
    },
    onError: ({ error: { validationErrors, serverError } }) => {
      if (validationErrors) {
        const { email } = validationErrors;
        setError(email ? email[0] : "");
      }
      if (serverError) {
        toast({
          title: "Soemthing went wrong",
          description: serverError,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <form action={execute} className="flex flex-col gap-6">
      {message && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-primary text-sm leading-6">{message}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          name="email"
        />
        {error ? (
          <p className="text-sm leading-4 text-destructive">{error}</p>
        ) : (
          <p className="text-sm leading-5 text-muted-foreground">
            Please enter your registered email. We will send you the
            instructions to reset your password.
          </p>
        )}
      </div>
      <Button
        disabled={isExecuting}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send
      </Button>
    </form>
  );
}
