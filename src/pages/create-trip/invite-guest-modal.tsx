import { AtSign, Plus, X } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";

interface InviteGuestModalProps {
  closeGuestModal: () => void;
  emailsToInvite: string[];
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void;
  removeEmailFromInvite: (email: string) => void;
}

export function InviteGuestModal({
  addNewEmailToInvite,
  closeGuestModal,
  emailsToInvite,
  removeEmailFromInvite,
}: InviteGuestModalProps) {
  return (
    <Modal
      closeAction={closeGuestModal}
      title="Selecionar convidados"
      subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
      content={
        <>
          <div className="flex flex-wrap gap-2">
            {emailsToInvite.map((email) => {
              return (
                <div
                  key={email}
                  className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
                >
                  <span className="text-zinc-300">{email}</span>
                  <button type="button">
                    <X
                      onClick={() => removeEmailFromInvite(email)}
                      className="size-4 text-zinc-400"
                    />
                  </button>
                </div>
              );
            })}
          </div>
          <div className="w-full h-px bg-zinc-800"></div>
          <form
            onSubmit={addNewEmailToInvite}
            className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2"
          >
            <div className="px-2 flex items-center flex-1 gap-2">
              <AtSign className="text-zinc-400 size-5" />
              <Input
                type="email"
                name="email"
                placeholder="Digite o e-mail do convidado"
              />
            </div>
            <Button type="submit">
              Convidar
              <Plus className="size-5" />
            </Button>
          </form>
        </>
      }
    />
  );
}
