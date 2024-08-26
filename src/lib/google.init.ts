import { Google } from "arctic";

export const google = new Google(
  process.env.GOOGLE_CID!,
  process.env.GOOGLE_CSE!,
  "http://localhost:3000/api/login/google/callback"
);
