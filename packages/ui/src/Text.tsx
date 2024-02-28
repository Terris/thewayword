import { createElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@repo/utils";

const textVariants = cva("text", {
  variants: {
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export function Text({ children, as, className, size }: TextProps) {
  return createElement(
    as ?? "p",
    { className: cn(textVariants({ size, className })) },
    children
  );
}
