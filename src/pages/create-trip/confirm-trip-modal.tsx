import { User } from "lucide-react";
import { FormEvent } from "react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { ptBR } from "date-fns/locale";

interface ConfirmTripModalProps {
  destination: string;
  eventStartAndEndDates: DateRange | undefined;
  closeConfirmTripModal: () => void;
  createTrip: (event: FormEvent<HTMLFormElement>) => void;
  setOwnerName: (name: string) => void;
  setOwnerEmail: (email: string) => void;
}

export function ConfirmTripModal({
  destination,
  eventStartAndEndDates,
  closeConfirmTripModal,
  createTrip,
  setOwnerName,
  setOwnerEmail,
}: ConfirmTripModalProps) {
  const displayedDate =
    eventStartAndEndDates?.from && eventStartAndEndDates?.to
      ? `${format(eventStartAndEndDates.from, "d' de 'MMMM' de 'yyyy", {
          locale: ptBR,
        })} a ${format(eventStartAndEndDates.to, "d' de 'MMMM' de 'yyyy", {
          locale: ptBR,
        })}`
      : null;

  return (
    <Modal
      closeAction={closeConfirmTripModal}
      title="Confirmar criação da viagem"
      subtitle={
        <>
          Para concluir a criação da viagem para{" "}
          <span className="text-zinc-100 font-semibold">{destination}</span> nas
          datas de{" "}
          <span className="text-zinc-100 font-semibold">{displayedDate}</span>{" "}
          preencha seus dados abaixo:
        </>
      }
      content={
        <form onSubmit={createTrip} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <Input
              onChange={(event) => setOwnerName(event.target.value)}
              name="name"
              placeholder="Seu nome completo"
            />
          </div>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <Input
              onChange={(event) => setOwnerEmail(event.target.value)}
              type="email"
              name="email"
              placeholder="Seu e-mail pessoal"
            />
          </div>
          <Button type="submit" size="full">
            Confirmar criação da viagem
          </Button>
        </form>
      }
    />
  );
}
