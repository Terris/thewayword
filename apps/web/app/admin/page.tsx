"use client";

import { api } from "@repo/convex";
import { Button, LoadingBox, Text } from "@repo/ui";
import { cn } from "@repo/utils";
import { useMutation, useQuery } from "convex/react";
import { CheckSquare2 } from "lucide-react";

export default function AdminPage() {
  const allUndoneFeedback = useQuery(api.feedback.findAllUndoneAsAdmin);
  const allDoneFeedback = useQuery(api.feedback.findAllDoneAsAdmin);

  const isLoading = allUndoneFeedback === undefined;

  const updateFeedbackRecord = useMutation(api.feedback.updateById);

  if (isLoading) return <LoadingBox />;

  return (
    <div className="w-full p-8">
      <div className="max-w-[600px]">
        <Text className="font-bold text-xl pb-8">
          Admin <span className="font-normal">Feedback entries</span>
        </Text>
        <Text className="font-soleil font-bold text-sm">TO DO</Text>
        <hr className="mb-4" />
        {allUndoneFeedback.map((feedback) => (
          <div
            key={feedback._id}
            className="border-b border-dashed mb-4 pb-4 flex gap-4"
          >
            <div className="w-full">
              <Text className="font-soleil font-bold pb-2">
                {feedback.user?.name} — {feedback.user?.email}
              </Text>
              <Text className="italic pb-4">
                &ldquo;{feedback.message}&rdquo;
              </Text>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                updateFeedbackRecord({ id: feedback._id, isDone: true })
              }
            >
              <CheckSquare2 className="w-4 h-4" />{" "}
            </Button>
          </div>
        ))}
        <Text className="font-soleil font-bold text-sm pt-4">DONE</Text>
        <hr className="mb-4" />
        {allDoneFeedback?.map((feedback) => (
          <div
            key={feedback._id}
            className="border-b border-dashed mb-4 pb-4 flex gap-4"
          >
            <div className="w-full">
              <Text className="font-soleil font-bold pb-2">
                {feedback.user?.name} — {feedback.user?.email}
              </Text>
              <Text className="italic pb-4">
                &ldquo;{feedback.message}&rdquo;
              </Text>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn(feedback.isDone && "text-green-500")}
              onClick={() =>
                updateFeedbackRecord({ id: feedback._id, isDone: false })
              }
            >
              <CheckSquare2 className="w-4 h-4" />{" "}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
