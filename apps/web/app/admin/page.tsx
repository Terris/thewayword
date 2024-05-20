"use client";

import { api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { useQuery } from "convex/react";

export default function AdminPage() {
  const allFeedback = useQuery(api.feedback.findAllAsAdmin);
  const isLoading = allFeedback === undefined;

  if (isLoading) return <LoadingBox />;

  return (
    <div className="w-full p-8">
      <div className="max-w-[600px]">
        <Text className="font-bold text-lg pb-4">Feedback entries</Text>
        {allFeedback.map((feedback) => (
          <div key={feedback._id} className="border-b">
            <Text className="font-soleil">
              {feedback.user?.name} — {feedback.user?.email}
            </Text>
            <Text className="italic pb-4">
              &ldquo;{feedback.message}&rdquo;
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
