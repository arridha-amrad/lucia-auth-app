import { validateRequest } from "@/auth";
import ButtonLogout from "@/ButtonLogout";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
      <div>
        <p>username : {user.username}</p>
        <p>email : {user.email}</p>
        <p>isVerified : {user.emailVerified ? "true" : "false"}</p>
        <p>githubId : {user.githubId}</p>
        <p>googleId : {user.googleId}</p>
        <p>id : {user.id}</p>
      </div>
      <ButtonLogout />
    </div>
  );
}
