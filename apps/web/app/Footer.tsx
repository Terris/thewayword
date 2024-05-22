"use client";

import { type ReactNode } from "react";
import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";

export function Footer() {
  const { me } = useMeContext();
  return (
    <div className="w-full border-t py-8 mt-8">
      <div className="container flex flex-col items-start justify-start md:flex-row">
        <Text className="w-full text-sm p-2">
          Copyright &copy; 2024 Terris Kremer
        </Text>
        {me ? (
          <div className="w-full flex flex-col items-start justify-start md:flex-row md:justify-end md:gap-8">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/shop">Shop</FooterLink>
            <FooterLink href="/feedback">Feedback</FooterLink>
            <FooterLink href="/roadmap">Roadmap</FooterLink>
          </div>
        ) : null}
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
        "p-2 rounded font-bold whitespace-nowrap hover:text-amber-400 transition-all",
        isActive && "bg-neutral-200 hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
