import { AtSign, CheckCircle2, CircleDashed, Plus, X } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";
import clsx from "clsx";

interface InviteGuestModalProps {
  isEdit?: boolean;
  tripId?: string;
  participants?: {
    id: string;
    name: string | null;
    email: string;
    is_confirmed: boolean;
    is_owner: boolean;
  }[];
  setReloadParticipants?: (reloadParticipants: boolean) => void;
  closeGuestModal: () => void;
  emailsToInvite?: string[];
  addNewEmailToInvite?: (event: FormEvent<HTMLFormElement>) => void;
  removeEmailFromInvite?: (email: string) => void;
}

export function InviteGuestModal({
  isEdit,
  tripId,
  participants,
  setReloadParticipants,
  addNewEmailToInvite,
  closeGuestModal,
  emailsToInvite,
  removeEmailFromInvite,
}: InviteGuestModalProps) {
  async function cancelParticipant(id: string) {
    await api
      .delete(`/participants/${id}/cancel`)
      .then(() => setReloadParticipants?.(true));
  }

  async function inviteParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = event.currentTarget;

    const data = new FormData(input);
    const email = data.get("email")?.toString();

    if (!email) return;
    await api
      .post(`/trips/${tripId}/invites`, { email })
      .then(() => setReloadParticipants?.(true));

    input.reset();
  }

  async function confirmParticipant(id: string) {
    await api
      .get(`/participants/${id}/confirm`)
      .then(() => setReloadParticipants?.(true));
  }

  return (
    <Modal
      closeAction={closeGuestModal}
      title={`${isEdit ? "Gerenciar" : "Selecionar"} convidados`}
      subtitle={
        !isEdit &&
        "Os convidados irão receber e-mails para confirmar a participação na viagem."
      }
      content={
        <>
          <div className="flex flex-wrap gap-2">
            {isEdit
              ? participants?.map((participant) => {
                  return (
                    <div
                      key={participant.id}
                      className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
                    >
                      {participant.is_confirmed ? (
                        <CheckCircle2
                          className={clsx(
                            "size-4 shrink-0 text-green-400 hover:text-zinc-100 cursor-pointer",
                            participant.is_owner &&
                              "cursor-default hover:text-green-400"
                          )}
                        />
                      ) : (
                        <CircleDashed
                          onClick={() => confirmParticipant(participant.id)}
                          className={clsx(
                            "size-4 shrink-0 text-zinc-400 hover:text-zinc-100 cursor-pointer",
                            participant.is_owner &&
                              "cursor-default hover:text-zinc-400"
                          )}
                        />
                      )}
                      <span className="text-zinc-300">{participant.email}</span>
                      <Button type="button">
                        <X
                          onClick={() => cancelParticipant(participant.id)}
                          className="size-4 text-zinc-400 hover:text-zinc-100"
                        />
                      </Button>
                    </div>
                  );
                })
              : emailsToInvite?.map((email) => {
                  return (
                    <div
                      key={email}
                      className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
                    >
                      <span className="text-zinc-300">{email}</span>
                      <Button type="button">
                        <X
                          onClick={() => removeEmailFromInvite?.(email)}
                          className="size-4 text-zinc-400 hover:text-zinc-100"
                        />
                      </Button>
                    </div>
                  );
                })}
          </div>
          <div className="w-full h-px bg-zinc-800"></div>
          <form
            onSubmit={isEdit ? inviteParticipant : addNewEmailToInvite}
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
            <Button type="submit" variant="primary">
              Convidar
              <Plus className="size-5" />
            </Button>
          </form>
        </>
      }
    />
  );
}
