import { Text } from "@repo/ui";

export default function RoadmapPage() {
  return (
    <div className="w-full p-8 max-w-[740px] mx-auto">
      <Text className="text-3xl md:text-4xl pb-8 font-bold">Roadmap</Text>
      <Text className="text-lg font-clarendon font-light leading-relaxed pb-8">
        I&rsquo;m working hard to get this thing ship-shape and a real pleasure
        to use. Here&rsquo;s an evolving list of features and improvements that
        I&rsquo;m working on.
      </Text>
      <Text className="font-bold uppercase tracking-wide pb-4">
        Planned Features
      </Text>
      <ul className="pb-8 list-disc pl-5">
        <li>Users can bucket list a log</li>
        <li>Users can include other users in a log</li>
        <li>Users can add gallery image blocks</li>
        <li>Users can create detailed maps</li>
        <li>Users can embed videos</li>
        <li>Users can print / download adventure logs</li>
        <li>Users can purchase printed physical adventure logs</li>
        <li>Users can download a social media kit</li>
        <li>Users can view a map of all adventure logs</li>
        <li>
          User can click a location and see all logs with the same location
        </li>
        <li>User can turn off comments for their own logs</li>
      </ul>
    </div>
  );
}
