import Link from "next/link";
import FormLogin from "./FormLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
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
            <FormLogin />
            <div className="pt-6 text-center text-sm">
              Don't have an account?
              <Link className="text-primary pl-1" href="/register">
                Register
              </Link>
            </div>
            <div className="py-3 text-center text-sm">
              <Link className="text-primary" href="/forgot-password">
                forgot password ?
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
