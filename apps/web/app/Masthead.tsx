"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useMeContext } from "@repo/auth/context";
import { Logo } from "@repo/ui";
import { ThemeModeToggle } from "@repo/ui/ThemeModeToggle";

export function Masthead() {
  const { isAuthenticated } = useMeContext();

  return (
    <div className="w-full py-8 px-9 flex flex-col md:flex-row items-center justify-between leading-none font-bold">
      <div className="md:w-1/3 flex flex-col md:flex-row items-center justify-start gap-8">
        {isAuthenticated ? (
          <>
            <Link
              href="/feed"
              className="font-soleil transition-opacity hover:opacity-80"
            >
              Feed
            </Link>
            <Link
              href="/feed/popular"
              className="font-soleil transition-opacity hover:opacity-80"
            >
              Popular
            </Link>
            <Link
              href="/shop"
              className="font-soleil transition-opacity hover:opacity-80"
            >
              Shop
            </Link>
          </>
        ) : null}
      </div>
      <div className="md:w-1/3 flex flex-row items-center justify-center">
        <Link href="/" className="mr-12">
          <Logo width={120} className="fill-foreground" />
        </Link>
      </div>
      <div className="w-1/3 flex flex-row items-center justify-end gap-4">
        {isAuthenticated ? (
          <Link
            href="/adventure-logs/create"
            className="font-soleil transition-opacity hover:opacity-80"
          >
            Log an Adventure
          </Link>
        ) : null}
        <ThemeModeToggle />
        {isAuthenticated ? (
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonPopoverCard: "rounded shadow-md",
              },
            }}
          />
        ) : null}
        {/*
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>
        */}
      </div>
    </div>
  );
}
