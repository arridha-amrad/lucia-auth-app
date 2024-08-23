"use client";

import React from "react";
import { useFormState } from "react-dom";
import { verifyEmailAction } from "./action";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const initialState = {
  error: "",
};

export default function Form() {
  const [value, setValue] = React.useState("");

  const [state, action] = useFormState(verifyEmailAction, initialState);
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="space-y-2 self-center">
        <InputOTP
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
      <Button className="uppercase font-extrabold" type="submit">
        Verify
      </Button>
    </form>
  );
}
