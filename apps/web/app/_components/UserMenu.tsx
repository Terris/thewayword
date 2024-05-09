"use client";

import { CircleUserRound } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useMeContext } from "@repo/auth/context";
import Image from "next/image";

export function UserMenu() {
  const { me } = useMeContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-muted transition-colors">
        {me?.avatarUrl ? (
          <Image
            src={me.avatarUrl}
            width="32"
            height="32"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <CircleUserRound className="w-6 h-6" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/me/adventure-logs" className="cursor-pointer">
            My Logs
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/me/account" className="cursor-pointer">
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="w-full justify-start cursor-pointer"
        >
          <SignOutButton
            redirectUrl="/signin"
            signOutOptions={{
              redirectUrl: "/signin",
            }}
          >
            <Button
              className="w-full justify-start cursor-pointer"
              variant="ghost"
              size="sm"
            >
              Sign out
            </Button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
