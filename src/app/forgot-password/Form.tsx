"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Form() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const result = await fetch("/api/forgot-password", {
        body: JSON.stringify({ email }),
        method: "POST",
      });
      const data = await result.json();
      console.log(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          name="email"
        />
        <p className="text-sm leading-4 text-muted-foreground">
          We will send you a link to your registered email to reset your
          password
        </p>
      </div>
      <Button
        disabled={isLoading}
        className="uppercase font-extrabold"
        type="submit"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send
      </Button>
    </form>
  );
}
