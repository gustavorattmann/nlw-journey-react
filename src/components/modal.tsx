import { X } from "lucide-react";
import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";
import { Button } from "./button";

const modalVariants = tv({
  slots: {
    base: "w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5",
  },
});

const { base } = modalVariants();

interface ModalProps extends VariantProps<typeof modalVariants> {
  content: ReactNode;
  title: string;
  subtitle?: ReactNode | string;
  customClass?: string;
  closeAction: () => void;
}

export function Modal({
  title,
  subtitle,
  content,
  customClass,
  closeAction,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className={base({ class: customClass })}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button>
              <X className="size-5 text-zinc-400" onClick={closeAction} />
            </Button>
          </div>
          {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        </div>
        {content}
      </div>
    </div>
  );
}
