"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/use-toast";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { verify } from "./action";
import { Loader2 } from "lucide-react";

export default function Form() {
  const [value, setValue] = React.useState("");
  const { toast } = useToast();

  const { execute, isExecuting } = useAction(verify, {
    onError: ({ error: { serverError } }) => {
      if (serverError) {
        toast({
          title: "Oops, Something went wrong",
          description: serverError,
        });
      }
    },
  });

  return (
    <form action={execute} className="flex flex-col gap-3">
      <div className="space-y-2 self-center">
        <InputOTP
          name="code"
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p className="text-muted-foreground text-sm text-center">
        Enter the code you receive from email
      </p>
      <Button
        disabled={isExecuting}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isExecuting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
        Verify
      </Button>
    </form>
  );
}
