"use client";

import { useClerk } from "@clerk/nextjs";
import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const router = useRouter();
  const { signOut } = useClerk();

  async function handleSignOut() {
    await signOut(() => {
      router.push("/signin");
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-muted transition-colors">
        <CircleUserRound className="w-6 h-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
          onClick={() => {
            void handleSignOut();
          }}
          className="cursor-pointer"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
