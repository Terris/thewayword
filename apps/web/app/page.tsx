"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeContext } from "@repo/auth/context";
import { Button, LoadingScreen, Text } from "@repo/ui";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const { me, isLoading } = useMeContext();

  useEffect(() => {
    if (isLoading || !me) return;
    router.push("/feed");
  }, [me, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8">
      <div className="mx-auto md:w-[660px]">
        <Text
          as="h1"
          className="text-2xl pb-16 text-center tracking-tight md:text-4xl"
        >
          We&rsquo;re building an adventure club for those whose favorite days
          are spent outdoors.
        </Text>
        <div className="mx-auto text-center">
          <Link href="/signup">
            <Button
              type="button"
              variant="outline"
              className="text-foreground"
              size="lg"
            >
              Try It Out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
