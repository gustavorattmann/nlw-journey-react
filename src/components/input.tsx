import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const inputVariants = tv({
  slots: {
    base: "bg-transparent placeholder-zinc-400 text-lg outline-none flex-1",
  },
});

const { base } = inputVariants();

interface InputProps
  extends ComponentProps<"input">,
    VariantProps<typeof inputVariants> {
  customClass?: string;
}

export function Input({ customClass, ...props }: InputProps) {
  return <input {...props} className={base({ class: customClass })} />;
}
