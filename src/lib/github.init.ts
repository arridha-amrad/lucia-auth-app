import { GitHub } from "arctic";

export const github = new GitHub(
  process.env.GITHUB_CID!,
  process.env.GITHUB_CSE!
);
