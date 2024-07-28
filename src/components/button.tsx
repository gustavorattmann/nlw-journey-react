import type { ComponentProps, ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  slots: {
    base: "rounded-lg px-5 font-medium flex items-center justify-center gap-2",
  },
  variants: {
    variant: {
      transparent: "bg-transparent p-0",
      primary: "bg-lime-300 text-lime-900 hover:bg-lime-400",
      secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700",
      danger: "bg-rose-800 text-zinc-200 hover:bg-rose-700",
    },
    size: {
      default: "py-2",
      full: "w-full h-11",
    },
  },
  defaultVariants: {
    variant: "transparent",
    size: "default",
  },
});

const { base } = buttonVariants();

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  customClass?: string;
}

export function Button({
  children,
  customClass,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={base({ class: customClass, variant, size })}>
      {children}
    </button>
  );
}
