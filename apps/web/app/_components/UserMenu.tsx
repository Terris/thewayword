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

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-muted transition-colors">
        <CircleUserRound className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          asChild
          className="w-full justify-start cursor-pointer"
        >
          <SignOutButton redirectUrl="/signin">
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
