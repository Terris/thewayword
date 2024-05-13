import { Text } from "@repo/ui";

export default function RoadmapPage() {
  return (
    <div className="w-full p-8 pt-16 max-w-[740px] mx-auto text-lg">
      <Text className="text-3xl md:text-4xl leading-tight pb-8 font-bold">
        Roadmap
      </Text>
      <Text className="text-lg pb-8">
        I&rsquo;m working hard to get this thing ship-shape and a real pleasure
        to use. Here&rsquo;s an evolving list of features and improvements that
        I&rsquo;m working on.
      </Text>
      <Text className="font-soleil font-bold uppercase tracking-wide pb-4">
        Major Features
      </Text>
      <ul className="pb-8 list-disc pl-5">
        <li>Users can bucket list a log</li>
        <li>Users can include other users in a log</li>
        <li>Users can create detailed maps</li>
        <li>Users can embed videos</li>
        <li>Users can print / download adventure logs</li>
        <li>Users can purchase printed physical adventure logs</li>
        <li>Users can shop</li>
        <li>Users can download a social media kit</li>
        <li>Users can view a map of all adventure logs</li>
        <li className="line-through">Users can follow other users</li>
      </ul>
      <Text className="font-soleil font-bold uppercase tracking-wide pb-4">
        Quality of life
      </Text>
      <ul className="list-disc pl-5">
        <li>
          Improve date selection: re-opening the cal after selecting a date
          should automatically show the previously selected date
        </li>
        <li>
          Improve date selection: user should be able to go way back in time
          faster
        </li>
        <li>User can click on a tag and see logs with a similar tag</li>
        <li>
          User can click a location and see all logs with the same location
        </li>
        <li>
          Change user name to firstName and lastName for easier sync with clerk
          and resend
        </li>
        <li>User can turn off comments for their own logs</li>
        <li className="line-through">Add text formatting to story blocks</li>
        <li className="line-through">
          Add an alert box in the header that shows a list of events (e.g.
          someone commented on my post)
        </li>
        <li className="line-through">
          User can select a display size on image blocks
        </li>
        <li className="line-through">User can delete their own logs</li>
      </ul>
    </div>
  );
}
