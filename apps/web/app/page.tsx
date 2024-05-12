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
    <div className="w-full p-8 pt-16">
      <div className="my-16 mx-auto md:w-[700px]">
        <Text as="h1" className="text-4xl pb-16 text-center">
          An adventure club for those whose favorite days are spent outdoors.
        </Text>
        <div className="mx-auto text-center">
          <Link href="/signup">
            <Button type="button" className="font-black text-primary" size="lg">
              Try it out!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
