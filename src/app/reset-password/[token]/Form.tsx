"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction } from "next-safe-action/hooks";
import { resetPassword } from "./action";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Form() {
  const params = useParams();
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const { execute, isExecuting } = useAction(
    resetPassword.bind(null, params.token as string),
    {
      onSuccess: ({ data }) => {
        if (!data) return;
        setMessage(data);
      },
      onError: ({ error: { serverError, validationErrors } }) => {
        if (validationErrors) {
          const { password } = validationErrors;
          setError(password ? password[0] : "");
        }
        if (serverError) {
          toast({
            title: "Something went wrong",
            description: serverError,
            variant: "destructive",
          });
        }
      },
    }
  );

  return (
    <form action={execute} className="flex flex-col gap-4">
      {message && (
        <div className="bg-primary/10 p-4 rounded-lg">
          <p className="text-primary text-sm leading-6">{message}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="text" id="password" name="password" />
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Type your new password
          </p>
        )}
      </div>
      <Button
        disabled={isExecuting}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isExecuting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
        Reset My Password
      </Button>
    </form>
  );
}
