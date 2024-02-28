import { Text } from "@repo/ui";

export default function Home() {
  return (
    <div className="w-full p-8 pt-16">
      <div className="my-16 md:w-[700px]">
        <Text as="h1" className="text-4xl font-tuna pb-32">
          Build an indestructible company culture <br />
          with our work therapy and mentorship <br />
          sessions for your team.
        </Text>

        <Text className="text-xl font-bold font-tuna pb-2">
          Workplace orienteering
        </Text>
        <Text className="text-xl pb-16">
          Our mentors help you and your team navigate conflict and learn to work
          together to solve problems.
        </Text>

        <Text className="text-xl font-bold font-tuna pb-2">
          Leadership & growth pipelines
        </Text>
        <Text className="text-xl pb-32">
          Every member of your team is a leader
        </Text>
      </div>

      <div className="pt-32">
        <div className="w-1/3">
          <Text className="text-xl font-bold">Simple Pricing</Text>
          <Text className="text-xl pb-4">
            Our pricing is metered, so you only pay for what your team uses. You
            can set spending caps so there&rsquo;s no surprises.
          </Text>
        </div>
        <div className="w-1/3">
          <Text className="text-xl font-bold">Simple Pricing</Text>
          <Text className="text-xl pb-4">
            Our pricing is metered, so you only pay for what your team uses. You
            can set spending caps so there&rsquo;s no surprises.
          </Text>
        </div>
      </div>

      <div className="pt-32">
        <div className="w-full flex flex-row gap-16">
          <div className="w-1/3">
            <Text className="text-xl font-bold">Workplace orienteering</Text>
            <Text className="text-xl pb-4">
              Our mentors help you and your team navigate conflict and learn to
              work together to solve problems.
            </Text>
          </div>
          <div className="w-1/3">
            <Text className="text-xl font-bold">Simple Pricing</Text>
            <Text className="text-xl pb-4">
              Our pricing is metered, so you only pay for what your team uses.
              You can set spending caps so there&rsquo;s no surprises.
            </Text>
          </div>
          <div className="w-1/3">
            <Text className="text-xl font-bold">Simple Pricing</Text>
            <Text className="text-xl pb-4">
              Our pricing is metered, so you only pay for what your team uses.
              You can set spending caps so there&rsquo;s no surprises.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
