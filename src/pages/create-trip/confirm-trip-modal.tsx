import { User } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: (event: FormEvent<HTMLFormElement>) => void;
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
}: ConfirmTripModalProps) {
  return (
    <Modal
      closeAction={closeConfirmTripModal}
      title="Confirmar criação da viagem"
      subtitle={
        <>
          Para concluir a criação da viagem para{" "}
          <span className="text-zinc-100 font-semibold">
            Florianópolis, Brasil
          </span>{" "}
          nas datas de{" "}
          <span className="text-zinc-100 font-semibold">
            16 a 27 de Agosto de 2024
          </span>{" "}
          preencha seus dados abaixo:
        </>
      }
      content={
        <form onSubmit={createTrip} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <Input name="name" placeholder="Seu nome completo" />
          </div>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <Input type="email" name="email" placeholder="Seu e-mail pessoal" />
          </div>
          <Button type="submit" size="full">
            Confirmar criação da viagem
          </Button>
        </form>
      }
    />
  );
}
