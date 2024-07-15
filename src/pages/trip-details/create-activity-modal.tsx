import { Calendar, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface CreateActivityModalProps {
  closeCreateActivityModalOpen: () => void;
}

export function CreateActivityModal({
  closeCreateActivityModalOpen,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const occurs_at = data.get("occurs_at")?.toString();

    await api.post(`/trips/${tripId}/activities`, {
      title,
      occurs_at,
    });

    window.document.location.reload();
  }

  return (
    <Modal
      closeAction={closeCreateActivityModalOpen}
      title="Cadastrar atividade"
      subtitle="Todos convidados podem visualizar as atividades."
      content={
        <form onSubmit={createActivity} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <Input name="title" placeholder="Qual a atividade?" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Calendar className="text-zinc-400 size-5" />
              <Input
                type="datetime-local"
                name="occurs_at"
                placeholder="Data e horário da atividade"
              />
            </div>
          </div>
          <Button type="submit" size="full">
            Salvar atividade
          </Button>
        </form>
      }
    />
  );
}
