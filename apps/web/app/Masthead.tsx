"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useMeContext } from "@repo/auth/context";
import { useLockBodyScroll } from "@repo/hooks";
import { Button, Logo, LogoDark } from "@repo/ui";
import { cn } from "@repo/utils";
import { UserMenu } from "./_components/UserMenu";
import { UserAlertsMenu } from "./_components/UserAlertsMenu";

export function Masthead() {
  const pathname = usePathname();
  const { isAuthenticated } = useMeContext();
  const [pagesMenuIsOpen, setPagesMenuIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setPagesMenuIsOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="w-full  pt-8 pb-7 px-9 flex flex-row items-center justify-between leading-none font-bold">
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
          ) : (
            <MastheadLink href="/about">About</MastheadLink>
          )}
        </div>
        <div className="md:w-1/3 max-w-full mr-auto md:mr-0 flex flex-row items-center justify-start md:justify-center">
          <Link href={isAuthenticated ? "/feed" : "/"}>
            {resolvedTheme === "dark" ? (
              <LogoDark width={160} className="max-w-full -mt-[10px]" />
            ) : (
              <Logo width={160} className="max-w-full -mt-[10px]" />
            )}
          </Link>
        </div>
        <div className="w-1/3 flex flex-row items-center justify-end gap-4">
          {isAuthenticated ? (
            <div className="hidden md:flex flex-row items-center justify-end gap-4">
              <MastheadLink href="/adventure-logs/create">
                Log an adventure
              </MastheadLink>
            </div>
          ) : null}

          {isAuthenticated ? (
            <>
              <UserAlertsMenu />
              <UserMenu />
            </>
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
    <div className="absolute z-50 top-[100px] flex flex-col gap-1 w-full p-4 border-b border-t bg-background md:hidden">
      {isAuthenticated ? (
        <>
          <MastheadLink href="/feed">Feed</MastheadLink>
          {/* <MastheadLink href="/feed/popular">Popular</MastheadLink> */}
          <MastheadLink href="/shop">Shop</MastheadLink>
          <MastheadLink href="/about">About</MastheadLink>
          <hr />
          <MastheadLink href="/adventure-logs/create">
            Log an Adventure
          </MastheadLink>
          <MastheadLink href="/me/adventure-logs">My Logs</MastheadLink>
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
