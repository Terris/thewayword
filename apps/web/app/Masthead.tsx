"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useMeContext } from "@repo/auth/context";
import { Text } from "@repo/ui";
import { ThemeModeToggle } from "@repo/ui/ThemeModeToggle";
import { FlameKindling } from "lucide-react";
import { cn } from "@repo/utils";
import { paintFactory } from "./fonts";

export function Masthead() {
  const { isAuthenticated, me } = useMeContext();
  const path = usePathname();
  const isHomePath = path === "/";

  const hideHeader = [
    /^\/rsvp(?:\/.*)?$/, // /rsvp/[inviteToken]
  ].some((matcher) => matcher.test(path));

  if (hideHeader) return null;

  return (
    <div className="flex flex-row items-center justify-between w-full px-8 py-2 text-sm leading-none">
      <Link href="/" className=" flex flex-row items-center mr-6">
        <FlameKindling strokeWidth={2} className="w-6 h-6 mr-2" />
        <Text
          className={cn(
            paintFactory.className,
            "text-xl font-bold tracking-wider"
          )}
        >
          Bitty Brella
        </Text>
      </Link>

      {Boolean(isHomePath) && (
        <div className="flex flex-row items-center gap-8 mr-auto ml-4">
          <Link href="/" className="font-bold">
            How it works
          </Link>
          <Link href="/" className="font-bold">
            Pricing
          </Link>
          <Link href="/" className="font-bold">
            FAQs
          </Link>
          <Link href="/onboard" className="font-bold">
            Get started
          </Link>
        </div>
      )}
      {me?.isAuthorizedUser && me.organization?.slug ? (
        <div className="flex flex-row gap-8 ml-auto mr-8">
          <Link
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/org/${me.organization.slug}`}
            className="font-bold"
          >
            Dashboard
          </Link>
        </div>
      ) : null}

      <div className="flex flex-row items-center justify-between gap-4">
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
        ) : (
          <SignInButton mode="modal" />
        )}
      </div>
    </div>
  );
}
