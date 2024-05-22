"use client";

import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full p-8">
      <div className="pb-4 w-full flex flex-row items-center border-b border-dashed">
        <MeLink
          href="/me/adventure-logs"
          active={pathname === "/me/adventure-logs"}
        >
          My Public Logs
        </MeLink>
        <MeLink
          href="/me/adventure-logs/private"
          active={pathname === "/me/adventure-logs/private"}
        >
          My Private Logs
        </MeLink>
      </div>
      {children}
    </div>
  );
}

function MeLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-bold block pt-2 pb-2.5 px-4 rounded-lg transition-opacity hover:opacity-80",
        active && "bg-border"
      )}
    >
      {children}
    </Link>
  );
}
