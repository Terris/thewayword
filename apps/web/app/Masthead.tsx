"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useMeContext } from "@repo/auth/context";
import { Button, TheWaywordLogo } from "@repo/ui";
import { Menu, X } from "lucide-react";
import { useLockBodyScroll } from "@repo/hooks";
import { usePathname } from "next/navigation";
import { cn } from "@repo/utils";
import { UserMenu } from "./_components/UserMenu";

export function Masthead() {
  const pathname = usePathname();
  const { isAuthenticated } = useMeContext();
  const [pagesMenuIsOpen, setPagesMenuIsOpen] = useState(false);

  useEffect(() => {
    setPagesMenuIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="w-full container pt-8 pb-7 px-9 flex flex-row items-center justify-between leading-none font-bold">
        <Button
          variant="ghost"
          onClick={() => {
            setPagesMenuIsOpen((o) => !o);
          }}
          className="-ml-3 mr-3 md:hidden"
          size="icon"
        >
          {pagesMenuIsOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
        <div className="md:w-1/3 flex flex-row items-center justify-start">
          {isAuthenticated ? (
            <div className="hidden md:flex flex-row items-center justify-end gap-8">
              <MastheadLink href="/feed">Feed</MastheadLink>
              {/* <MastheadLink href="/feed/popular">Popular</MastheadLink> */}
              <MastheadLink href="/shop">Shop</MastheadLink>
            </div>
          ) : null}
        </div>
        <div className="md:w-1/3 mr-auto md:mr-0 flex flex-row items-center justify-start md:justify-center">
          <Link href={isAuthenticated ? "/feed" : "/"}>
            <TheWaywordLogo
              width={160}
              className="fill-foreground max-w-full -mt-[10px]"
            />
          </Link>
        </div>
        <div className="w-1/3 flex flex-row items-center justify-end gap-8">
          {isAuthenticated ? (
            <div className="hidden md:flex flex-row items-center justify-end gap-8">
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
    <div className="absolute z-10 top-[100px] flex flex-col gap-1 w-full p-4 border-b border-t bg-background md:hidden">
      {isAuthenticated ? (
        <>
          <MastheadLink href="/feed">Feed</MastheadLink>
          {/* <MastheadLink href="/feed/popular">Popular</MastheadLink> */}
          <MastheadLink href="/shop">Shop</MastheadLink>
          <MastheadLink href="/about">About</MastheadLink>
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
        isActive && "bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}
