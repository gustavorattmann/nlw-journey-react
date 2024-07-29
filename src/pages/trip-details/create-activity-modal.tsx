import { Calendar, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { FormEvent } from "react";
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
  success: {
    open: boolean;
    message: string;
    action: () => void;
  };
  error: {
    open: boolean;
    message: string;
    action: () => void;
  };
  setLoading: (loading: { open: boolean; message: string }) => void;
  setSuccess: (success: {
    open: boolean;
    message: string;
    action: () => void;
  }) => void;
  setError: (error: {
    open: boolean;
    message: string;
    action: () => void;
  }) => void;
}

export function CreateActivityModal({
  isEdit,
  activity,
  trip,
  setIsReloadActivity,
  closeCreateActivityModalOpen,
  success,
  error,
  setLoading,
  setSuccess,
  setError,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

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

    setLoading({ open: true, message: "Aguarde..." });

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
          setIsReloadActivity(true);
          setLoading({ open: false, message: "" });
          setSuccess({
            ...success,
            open: true,
            message: "Atividade atualizada com sucesso!",
          });
        })
        .catch((err) => {
          setLoading({ open: false, message: "" });
          setError({
            ...error,
            open: true,
            message:
              err.response.status === 400
                ? "Campo(s) inválido(s)!"
                : "Não foi possível criar a atividade.\nTente novamente mais tarde!",
          });
        });
    } else {
      await api
        .post(`/trips/${tripId}/activities`, {
          title,
          occurs_at,
        })
        .then(() => {
          setIsReloadActivity(true);
          setLoading({ open: false, message: "" });
          setSuccess({
            ...success,
            open: true,
            message: "Atividade incluída com sucesso!",
          });
        })
        .catch((err) => {
          setLoading({ open: false, message: "" });
          setError({
            ...error,
            open: true,
            message: err.response.status === 400 ? "Campo(s) inválido(s)!" : "",
          });
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
    </div>
  );
}
