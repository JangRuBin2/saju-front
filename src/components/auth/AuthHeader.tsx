"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "./LoginButton";
import { UserMenu } from "./UserMenu";

export function AuthHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  return session ? <UserMenu /> : <LoginButton />;
}
