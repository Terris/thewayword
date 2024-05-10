import { Text } from "@repo/ui";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full p-8 pt-16">
      <div className="container grid grid-cols-3 gap-4">
        <div className="">
          <Image
            src="/img/about-page-image.jpg"
            alt="product image"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded max-w-full"
          />
          <Text className="text-sm text-center pr-4 text-gray-200">01.</Text>
        </div>
      </div>
    </div>
  );
}
