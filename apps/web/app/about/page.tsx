import { Text } from "@repo/ui";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full p-8 pt-16 text-lg">
      <div className="flex flex-col items-start md:flex-row md:gap-16 md:px-16 pb-16">
        <div className="w-full md:w-1/2">
          <Text className="text-3xl md:text-4xl leading-tight pb-8">
            We&rsquo;re patrons of the outdoors and the organizations and
            institutions that help keep it pristine.
          </Text>
          <Text className="text-lg pb-8">
            The Wayword is dedicated to building a vibrant community of outdoor
            enthusiasts who share a profound appreciation for nature and a
            passion for adventure. Our platform aims to provide a space where
            members can express and explore their love for the outdoors in a
            manner that is uniquely their own, fostering connections and
            nurturing a deep-seated love for the natural world.
          </Text>
          <Text className="font-soleil font-bold uppercase tracking-wide pb-4">
            The Pitch
          </Text>
          <Text className="text-lg pb-4">
            &ldquo;My favorite days are spent outdoors but when the adventure is
            over and I&rsquo;m back to my busy life I find myself wishing I
            could do more with the artifacts of my journey than just dropping
            them into an endless feed of memes and advertisements. The Wayword
            is a social adventure journal that makes it easy to develop and
            publish the stories of our travels. On the platform, we create
            adventure logs with maps, pictures, and text and can share these
            logs with friends. My hope is that, as a Wayword user, I can both
            inspire and be inspired to spend more time outdoors and that the
            ephemera of these journeys become a more valuable memory.&rdquo;
          </Text>
          <Text className="pb-16 italic">
            Terris Kremer - Founder, The Wayword
          </Text>
        </div>
        <div className="w-full md:w-1/2">
          <Image
            src="/img/about-page-image.jpg"
            width="640"
            height="427"
            alt="Looking out over an expanse of mountains from inside a tent"
            className="rounded mb-8"
          />
          <Text className="font-soleil font-bold uppercase tracking-wide pb-4">
            Core Values
          </Text>
          <ol className="list-decimal pb-16 space-y-4 pl-4">
            <li>
              <strong>Community:</strong> We believe in the power of community
              to enrich lives and create enduring bonds among outdoor
              enthusiasts.
            </li>
            <li>
              <strong>Personalization:</strong> We value personal expression and
              strive to offer tools and features that empower members to
              personalize their adventure stories and share them with others.
            </li>
            <li>
              <strong>Education:</strong> We are committed to promoting outdoor
              education and environmental awareness, inspiring a sense of
              responsibility and stewardship for the natural world.
            </li>
            <li>
              <strong>Inclusivity:</strong> We welcome individuals from all
              backgrounds and skill levels, cultivating an inclusive and
              welcoming environment for everyone to enjoy the outdoors.
            </li>
            <li>
              <strong>Sustainability:</strong> We are dedicated to promoting
              sustainable practices and minimizing our impact on the
              environment, ensuring that future generations can continue to
              revel in the wonders of the outdoors.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
