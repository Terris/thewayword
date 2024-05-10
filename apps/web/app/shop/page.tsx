import { Text } from "@repo/ui";
import Image from "next/image";

export default function ShopPage() {
  return (
    <div className="w-full p-8 ">
      <Text className="text-2xl font-bold text-center">
        The Wayword Shop is coming soon!
      </Text>
      <Text className="text-center pb-16">
        ...but here&rsquo;s a preview of what&rsquo;s <i>in store</i>.
      </Text>
      <div className="container grid grid-cols-3 gap-4">
        <div className="group">
          <Image
            src="/img/products/gold-murder-noodle-hat-front.png"
            alt="product image"
            width={800}
            height={800}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded max-w-full group-hover:hidden"
          />
          <Image
            src="/img/products/gold-murder-noodle-hat-back.png"
            alt="product image"
            width={800}
            height={800}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="hidden rounded max-w-full group-hover:block"
          />
          <Text className="text-lg font-bold text-center pr-4 pt-8">
            Golden Murder Noodle Fitted Hat
          </Text>
          <Text className="text-center pr-4 italic text-gray-500">$34.99</Text>
        </div>
        <div className="group">
          <Image
            src="/img/products/red-murder-noodle-hat-front.png"
            alt="product image"
            width={800}
            height={800}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded max-w-full group-hover:hidden"
          />
          <Image
            src="/img/products/red-murder-noodle-hat-back.png"
            alt="product image"
            width={800}
            height={800}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="hidden rounded max-w-full group-hover:block"
          />
          <Text className="text-lg font-bold text-center pr-4 pt-8">
            Red Murder Noodle Fitted Hat
          </Text>
          <Text className="text-center pr-4 italic text-gray-500">$34.99</Text>
        </div>
      </div>
    </div>
  );
}
