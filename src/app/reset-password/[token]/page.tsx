import React from "react";
import Form from "./Form";
import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
};

type Props = {
  params: {
    token: string;
  };
};

export default function Page({ params }: Props) {
  if (!params.token) {
    redirect("/login");
  }
  return (
    <main className="min-h-screen w-full flex flex-col">
      <div className="flex-1 py-10 w-full">
        <div className="max-w-md mx-auto">
          <div className="py-4">
            <h1 className="text-3xl tracking-wider font-extrabold uppercase text-center">
              Lucia
            </h1>
          </div>
          <div className="border px-10 py-10 rounded-lg">
            <Form />
            <div className="pt-6 text-center text-sm">
              Back to
              <Link className="text-blue-500 pl-1" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[80px] gap-1 text-sm text-muted-foreground flex flex-col items-center justify-center border-t">
        <p>Crafted by Arridha Amrad</p>
        <p>#FreePalestine🇵🇸</p>
      </div>
    </main>
  );
}
