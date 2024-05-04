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

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-muted transition-colors">
        <CircleUserRound className="w-6 h-6" />
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
