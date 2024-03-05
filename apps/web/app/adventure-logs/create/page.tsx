"use client";

import { useRouter } from "next/navigation";
import { Text, Button } from "@repo/ui";
import { CreateLogForm } from "./CreateLogForm";

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 right-0 bg-background">
      <div className="q-full p-8 flex flex-row ">
        <Button
          variant="outline"
          onClick={() => {
            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
      <div className="w-full max-w-[600px] p-8 mx-auto flex flex-col justify-center">
        <Text className="text-2xl font-black italic pb-16 text-center">
          Log an Adventure!
        </Text>
        <CreateLogForm />
      </div>
    </div>
  );
}
