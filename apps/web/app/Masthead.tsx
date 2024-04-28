"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useMeContext } from "@repo/auth/context";
import { Button, Logo } from "@repo/ui";
import { Menu, X } from "lucide-react";
import { useLockBodyScroll } from "@repo/hooks";
import { usePathname } from "next/navigation";
import { cn } from "@repo/utils";
import { UserMenu } from "./_components/UserMenu";

export function Masthead() {
  const { isAuthenticated } = useMeContext();
  const [pagesMenuIsOpen, setPagesMenuIsOpen] = useState(false);

  return (
    <>
      <div className="w-full container pt-8 pb-7 px-9 flex flex-row items-center justify-between leading-none font-bold">
        <Button
          variant="ghost"
          onClick={() => {
            setPagesMenuIsOpen((o) => !o);
          }}
          className="-ml-4 mr-3 md:hidden"
          size="icon"
        >
          {pagesMenuIsOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
        <div className="hidden md:w-1/3 md:flex flex-row items-center justify-start gap-8">
          {isAuthenticated ? (
            <>
              <MastheadLink href="/feed">Feed</MastheadLink>
              {/* <MastheadLink href="/feed/popular">Popular</MastheadLink> */}
              <MastheadLink href="/shop">Shop</MastheadLink>
            </>
          ) : null}
        </div>
        <div className="md:w-1/3 flex flex-row items-center justify-center mr-auto md:mx-auto">
          <Link href={isAuthenticated ? "/feed" : "/"}>
            <Logo width={120} className="fill-foreground max-w-full" />
          </Link>
        </div>
        <div className="w-1/3 flex flex-row items-center justify-end gap-8">
          {isAuthenticated ? (
            <div className="hidden md:flex flex-row items-center justify-end gap-8">
              <MastheadLink href="/me/adventure-logs">My Logs</MastheadLink>
              <MastheadLink href="/adventure-logs/create">
                Log an Adventure
              </MastheadLink>
            </div>
          ) : null}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <MastheadLink href="/signin">Sign in</MastheadLink>
          )}
        </div>
      </div>
      {pagesMenuIsOpen ? <PagesMenu /> : null}
    </>
  );
}

function PagesMenu() {
  const { isAuthenticated } = useMeContext();
  useLockBodyScroll();
  return (
    <div className="absolute z-10 top-[104px] flex flex-col gap-1 w-full p-4 border-b border-t bg-background md:hidden">
      {isAuthenticated ? (
        <>
          <MastheadLink href="/feed">Feed</MastheadLink>
          {/* <MastheadLink href="/feed/popular">Popular</MastheadLink> */}
          <MastheadLink href="/shop">Shop</MastheadLink>
          <MastheadLink href="/about">Charter</MastheadLink>
          <hr />
          <MastheadLink href="/me/adventure-logs">My Logs</MastheadLink>
          <MastheadLink href="/adventure-logs/create">
            Log an Adventure
          </MastheadLink>
        </>
      ) : null}
    </div>
  );
}

function MastheadLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "p-2 rounded font-soleil whitespace-nowrap hover:text-muted transition-colors",
        isActive && "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
