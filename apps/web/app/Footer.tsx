"use client";

import { type ReactNode } from "react";
import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  return (
    <div className="w-full border-t py-8 mt-8">
      <div className="container flex flex-col items-start justify-start">
        <FooterLink href="/about">Charter</FooterLink>
      </div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "p-2 rounded font-soleil whitespace-nowrap hover:text-muted transition-all",
        isActive && "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
