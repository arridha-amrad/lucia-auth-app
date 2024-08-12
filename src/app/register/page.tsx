import { lucia } from "@/auth";
import prisma from "@/db";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const register = async (formData: FormData) => {
    "use server";
    const rawFormData = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    try {
      const hashedPassword = await hash(rawFormData.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      const newUser = await prisma.user.create({
        data: {
          email: rawFormData.email,
          username: rawFormData.username,
          password_hsh: hashedPassword,
        },
      });

      const session = await lucia.createSession(newUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return redirect("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="max-w-sm py-10 mx-auto">
      <form action={register} className="flex flex-col gap-3">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="bg-slate-700 text-slate-200 px-4 py-2"
            id="username"
            name="username"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            className="bg-slate-700 text-slate-200 px-4 py-2"
            type="text"
            id="email"
            name="email"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            className="bg-slate-700 text-slate-200 px-4 py-2"
            type="password"
            id="password"
            name="password"
          />
        </div>
        <button
          className="bg-blue-600 text-white rounded-lg py-2 px-4"
          type="submit"
        >
          Register
        </button>
      </form>
    </main>
  );
}
