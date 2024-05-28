import * as React from "react";
import { cn } from "@repo/utils";
import { type VariantProps, cva } from "class-variance-authority";

const inputVariants = cva("flex w-full focus-visible:outline-none", {
  variants: {
    variant: {
      default:
        "h-10 rounded-md border border-input bg-background px-3 py-2 font-mono font-medium placeholder leading-relaxed text-sm file:border-0 file:bg-transparent file:text-sm placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50",
    },
    sizeY: {
      default: "h-10 px-4",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-4",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    sizeY: "default",
  },
});

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, sizeY, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, sizeY, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
