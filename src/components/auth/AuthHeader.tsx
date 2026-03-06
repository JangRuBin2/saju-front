"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "./LoginButton";
import { UserMenu } from "./UserMenu";
import { TestUserBadge } from "./TestUserBadge";

const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

export function AuthHeader() {
  const { data: session, status } = useSession();

  if (isTestMode) return <TestUserBadge />;

  if (status === "loading") return null;

  return session ? <UserMenu /> : <LoginButton />;
}
