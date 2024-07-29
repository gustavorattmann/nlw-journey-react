import { Calendar, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { FormEvent, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

interface CreateActivityModalProps {
  isEdit?: boolean;
  activity?: {
    id: string;
    title: string;
    occurs_at: string;
  };
  trip:
    | {
        id: string;
        destination: string;
        starts_at: string;
        ends_at: string;
        is_confirmed: boolean;
      }
    | undefined;
  setIsReloadActivity: (isReloadActivity: boolean) => void;
  closeCreateActivityModalOpen: () => void;
}

export function CreateActivityModal({
  isEdit,
  activity,
  trip,
  setIsReloadActivity,
  closeCreateActivityModalOpen,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

  const [loading, setLoading] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  // const [isSuccess, setIsSuccess] = useState<boolean>(false);

  function changeTimezone(date: string | undefined) {
    if (date) {
      const dateTimezoneChanged =
        formatInTimeZone(date, "America/Sao_Paulo", "yyyy-MM-dd HH:mm", {
          locale: ptBR,
        }).trim() || null;

      return dateTimezoneChanged?.replace(" ", "T");
    }

    return;
  }

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading({ open: true, message: "Criando viagem..." });

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const occurs_at = data.get("occurs_at")?.toString();

    if (isEdit) {
      await api
        .put(`/trips/${tripId}/activity/${activity?.id}`, {
          title,
          occurs_at,
        })
        .then(() => {
          setLoading({ open: false, message: "" });
          setIsReloadActivity(true);
        });
    } else {
      await api
        .post(`/trips/${tripId}/activities`, {
          title,
          occurs_at,
        })
        .then(() => {
          setLoading({ open: false, message: "" });
          setIsReloadActivity(true);
        });
    }
  }

  return (
    <div>
      <Modal
        closeAction={closeCreateActivityModalOpen}
        title={`${isEdit ? "Alterar" : "Cadastrar"} atividade`}
        subtitle={
          !isEdit ? "Todos convidados podem visualizar as atividades." : null
        }
        content={
          <form onSubmit={createActivity} className="space-y-3">
            <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Tag className="text-zinc-400 size-5" />
              <Input
                name="title"
                placeholder="Qual a atividade?"
                defaultValue={isEdit ? activity?.title : ""}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                <Calendar className="text-zinc-400 size-5" />
                <Input
                  type="datetime-local"
                  name="occurs_at"
                  placeholder="Data e horário da atividade"
                  min={changeTimezone(trip?.starts_at)}
                  max={changeTimezone(trip?.ends_at)}
                  defaultValue={
                    isEdit && activity?.occurs_at
                      ? changeTimezone(activity.occurs_at)
                      : ""
                  }
                />
              </div>
            </div>
            <Button type="submit" size="full" variant="primary">
              Salvar atividade
            </Button>
          </form>
        }
      />
      {loading.open && <Modal type="loading" text={loading.message} />}
    </div>
  );
}
