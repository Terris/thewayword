import { BadgePlus, Bell } from "lucide-react";
import {
  Button,
  CountBadge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "@repo/ui";
import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@repo/convex";
import { useRouter } from "next/navigation";
import { cn } from "@repo/utils";
import Link from "next/link";

export function CreateMenu() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={"rounded-full flex-shrink-0"}
        >
          <BadgePlus className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuItem
          className="cursor-pointer font-bold py-2"
          onClick={() => router.push("/adventure-logs/create")}
        >
          Log an adventure
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
