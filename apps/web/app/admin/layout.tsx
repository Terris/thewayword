import { type ReactNode } from "react";
import { PrivatePageWrapper } from "@repo/auth";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      <div className="w-full mx-8 flex flex-row items-center gap-8 border-b">
        <AdminLink href="/admin">Admin</AdminLink>
        <AdminLink href="/admin/shop">Shop</AdminLink>
        <AdminLink href="/admin/products">Products</AdminLink>
      </div>
      {children}
    </PrivatePageWrapper>
  );
}

function AdminLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link href={href} className="text-sm p-4 font-soleil font-bold">
      {children}
    </Link>
  );
}
