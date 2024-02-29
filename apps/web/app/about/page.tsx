import { Text } from "@repo/ui";

export default function AboutPage() {
  return (
    <div className="w-full p-8 pt-32">
      <div className="container mx-auto">
        <Text className="text-4xl leading-tight max-w-[650px]">
          We&rsquo;re patrons of the outdoors and the organizations and
          institutions that help keep it pristine.
        </Text>
      </div>
    </div>
  );
}
