"use client";

import { type ReactNode } from "react";
import { PrivatePageWrapper } from "@repo/auth";
import Link from "next/link";
import { cn } from "@repo/utils";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      <div className="w-full mx-8 pb-2 flex flex-row items-center gap-8 border-b">
        <AdminLink href="/admin">Admin</AdminLink>
        <AdminLink href="/admin/shop">Shop</AdminLink>
        <AdminLink href="/admin/products">Products</AdminLink>
      </div>
      {children}
    </PrivatePageWrapper>
  );
}

function AdminLink({ children, href }: { children: ReactNode; href: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "p-2 rounded text-sm font-soleil whitespace-nowrap hover:text-muted transition-colors",
        isActive && "bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}