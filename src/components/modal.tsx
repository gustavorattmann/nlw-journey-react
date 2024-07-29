import { CircleCheckBig, CircleX, TriangleAlert, X } from "lucide-react";
import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";
import { Button } from "./button";
import clsx from "clsx";

const modalVariants = tv({
  slots: {
    base: "w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5",
  },
});

const { base } = modalVariants();

interface ModalProps extends VariantProps<typeof modalVariants> {
  content?: ReactNode;
  title?: string;
  subtitle?: ReactNode | string;
  text?: string;
  customClass?: string;
  closeAction?: () => void;
  confirmAction?: () => void;
  type?: string;
}

export function Modal({
  title,
  subtitle,
  text,
  content,
  customClass,
  type,
  closeAction,
  confirmAction,
}: ModalProps) {
  if (
    type &&
    !["confirm", "invite", "success", "error", "loading"].includes(type)
  )
    type = "default";

  if (type === "loading") customClass = "w-96 space-y-0";

  if (type && ["success", "error"].includes(type))
    customClass = "w-4/12 space-y-0";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className={clsx(base({ class: customClass }))}>
        <div className="space-y-2">
          <div>
            {type !== "loading" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {type === "confirm" && (
                    <TriangleAlert className="size-4 text-yellow-200" />
                  )}
                  <h2 className="text-lg font-semibold">
                    {type === "confirm"
                      ? "Deseja confirmar essa ação?"
                      : type === "invite"
                      ? "Confirmar participação?"
                      : title || ""}
                  </h2>
                </div>
                <Button>
                  <X className="size-5 text-zinc-400" onClick={closeAction} />
                </Button>
              </div>
            )}
          </div>
          {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
        </div>
        {type && ["confirm", "invite"].includes(type) && confirmAction ? (
          <div className="space-y-5">
            {type === "confirm" ? (
              <span>
                Ao confirmar essa ação, o processo{" "}
                <span className="font-bold">não</span> poderá ser revertido.
              </span>
            ) : type === "invite" ? (
              <span>
                Ao confirmar sua participação, você estará fazendo parte da
                viagem ao qual foi convidado.
              </span>
            ) : null}
            {
              <div className="flex items-center justify-between">
                <Button onClick={() => closeAction?.()} variant="danger">
                  Cancelar
                </Button>
                <Button onClick={() => confirmAction()} variant="confirm">
                  Confirmar
                </Button>
              </div>
            }
          </div>
        ) : type && ["success", "error", "loading"].includes(type) ? (
          <div>
            {type === "success" ? (
              <div className="flex flex-col items-center justify-center">
                <CircleCheckBig className="size-40 text-green-700 mb-2" />
                <span className="text-center text-xl font-bold text-wrap whitespace-pre px-10">
                  {text || "Sucesso!"}
                </span>
              </div>
            ) : type === "error" ? (
              <div className="flex flex-col items-center justify-center">
                <CircleX className="size-40 text-red-700 mb-2 " />
                <span className="text-center text-xl font-bold text-wrap whitespace-pre px-10">
                  {text ||
                    "Ocorreu um erro inesperado.\nTente novamente mais tarde!"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <svg
                  className="animate-spin h-32 w-32"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                    stroke="currentColor"
                    stroke-width="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="text-blue-400"
                  ></path>
                </svg>
                <span className="text-center text-xl font-bold text-wrap whitespace-pre">
                  {text || "Carregando..."}
                </span>
              </div>
            )}
            {["success", "error"].includes(type) && (
              <div className="flex items-center justify-center mt-6">
                <Button onClick={() => closeAction?.()} variant="confirm">
                  Fechar
                </Button>
              </div>
            )}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
