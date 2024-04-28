"use client";

import { CircleUserRound } from "lucide-react";
import {
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
        <DropdownMenuItem>
          <SignOutButton redirectUrl="/signin" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
