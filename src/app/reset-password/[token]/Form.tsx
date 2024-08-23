"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { ChangeEvent, useState } from "react";

export default function Form() {
  const [password, setPassword] = useState("");

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input type="text" id="password" name="password" />
        <p className="text-muted-foreground text-sm">Type your new password</p>
      </div>
      <Button className="uppercase font-extrabold" type="submit">
        Reset My Password
      </Button>
    </form>
  );
}
