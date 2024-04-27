"use client";

import { type ReactNode } from "react";
import { cn } from "@repo/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";

export function Footer() {
  const { isAuthenticated } = useMeContext();
  return (
    <div className="w-full border-t py-8 mt-8">
      <div className="container flex flex-col items-start justify-start md:flex-row">
        <Text className="w-full text-sm p-2">
          Copyright &copy; 2024 Terris Kremer
        </Text>
        {isAuthenticated ? (
          <div className="w-full flex flex-col items-start justify-start md:flex-row md:justify-end md:gap-8">
            <FooterLink href="/about">Charter</FooterLink>
            <FooterLink href="/shop">Shop</FooterLink>
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
        "p-2 rounded font-soleil whitespace-nowrap hover:text-muted transition-all",
        isActive && "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}