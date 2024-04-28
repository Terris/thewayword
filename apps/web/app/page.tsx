"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeContext } from "@repo/auth/context";
import { LoadingScreen, Text } from "@repo/ui";
import { JoinWaitlistForm } from "./JoinWaitlistForm";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useMeContext();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    router.push("/feed");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 pt-16">
      <div className="my-16 mx-auto md:w-[700px]">
        <Text as="h1" className="text-4xl pb-16 text-center">
          An adventure club for those whose favorite days are spent outdoors.
        </Text>
        <div className="max-w-[600px] mx-auto">
          <JoinWaitlistForm />
        </div>
      </div>
    </div>
  );
}
