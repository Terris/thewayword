"use client";

import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full p-8">
      <div className="pb-4 w-full flex flex-row items-center gap-6 border-b border-dashed">
        <MeLink
          href="/me/adventure-logs"
          active={pathname === "/me/adventure-logs"}
        >
          My Logs
        </MeLink>
        <MeLink
          href="/me/adventure-logs/drafts"
          active={pathname === "/me/adventure-logs/drafts"}
        >
          Drafts
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
        "font-soleil block py-2 px-4 rounded-lg text-sm font-bold transition-opacity hover:opacity-80",
        active && "bg-border"
      )}
    >
      {children}
    </Link>
  );
}
