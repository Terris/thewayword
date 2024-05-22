import { Text } from "@repo/ui";
import Link from "next/link";

export default function FeedbackSuccessPage() {
  return (
    <div className="w-full max-w-[600px] p-8 mx-auto flex flex-col gap-4">
      <Text className="text-xl font-bold">Thank you!</Text>
      <Text>
        We could not be more grateful for your time and feedback. We&rsquo;ll
        address your thoughts as soon as possible.
      </Text>
      <Text>
        <Link href="/feed" className="underline hover:text-muted">
          Go back to the home page
        </Link>{" "}
        or{" "}
        <Link href="/feedback" className="underline hover:text-muted">
          submit more feedback
        </Link>
        .
      </Text>
    </div>
  );
}
