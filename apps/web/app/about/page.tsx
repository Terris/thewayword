import { Text } from "@repo/ui";

export default function AboutPage() {
  return (
    <div className="w-full p-8 pt-16 max-w-[740px] mx-auto text-lg">
      <Text className="text-3xl md:text-4xl leading-tight pb-8">
        We&rsquo;re patrons of the outdoors and the organizations and
        institutions that help keep it pristine.
      </Text>
      <Text className="text-lg pb-16">
        BittyBrella is dedicated to building a vibrant community of outdoor
        enthusiasts who share a profound appreciation for nature and a passion
        for adventure. Our platform aims to provide a space where members can
        express and explore their love for the outdoors in a manner that is
        uniquely their own, fostering connections and nurturing a deep-seated
        love for the natural world.
      </Text>

      <Text className="font-soleil font-bold uppercase tracking-wide pb-4">
        Core Values
      </Text>
      <ol className="list-decimal pb-16 space-y-4 pl-4">
        <li>
          <strong>Community:</strong> We believe in the power of community to
          enrich lives and create enduring bonds among outdoor enthusiasts.
        </li>
        <li>
          <strong>Personalization:</strong> We value personal expression and
          strive to offer tools and features that empower members to personalize
          their outdoor experiences and share them with others.
        </li>
        <li>
          <strong>Education:</strong> We are committed to promoting outdoor
          education and environmental awareness, inspiring a sense of
          responsibility and stewardship for the natural world.
        </li>
        <li>
          <strong>Inclusivity:</strong> We welcome individuals from all
          backgrounds and skill levels, cultivating an inclusive and welcoming
          environment for everyone to enjoy the outdoors.
        </li>
        <li>
          <strong>Sustainability:</strong> We are dedicated to promoting
          sustainable practices and minimizing our impact on the environment,
          ensuring that future generations can continue to revel in the wonders
          of the outdoors.
        </li>
      </ol>
    </div>
  );
}
