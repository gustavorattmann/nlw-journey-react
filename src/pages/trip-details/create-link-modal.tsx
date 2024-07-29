import { Link2, Tag } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface CreateLinkModalProps {
  isEdit?: boolean;
  link?:
    | {
        id: string;
        title: string;
        url: string;
      }
    | undefined;
  closeCreateLinkModalOpen: () => void;
  setIsReloadLink: (isReloadLink: true) => void;
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

export function CreateLinkModal({
  isEdit,
  link,
  closeCreateLinkModalOpen,
  setIsReloadLink,
  success,
  error,
  setLoading,
  setSuccess,
  setError,
}: CreateLinkModalProps) {
  const { tripId } = useParams();

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading({ open: true, message: "Aguarde..." });

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();

    if (isEdit) {
      await api
        .put(`/trips/${tripId}/links/${link?.id}`, {
          title,
          url,
        })
        .then(() => {
          setIsReloadLink(true);
          setLoading({ open: false, message: "" });
          setSuccess({
            ...success,
            open: true,
            message: "Link atualizado com sucesso!",
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
                : "Não foi possível criar o link.\nTente novamente mais tarde!",
          });
        });
    } else {
      await api
        .post(`/trips/${tripId}/links`, {
          title,
          url,
        })
        .then(() => {
          setIsReloadLink(true);
          setLoading({ open: false, message: "" });
          setSuccess({
            ...success,
            open: true,
            message: "Link incluído com sucesso!",
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
    <Modal
      closeAction={closeCreateLinkModalOpen}
      title={`${isEdit ? "Alterar" : "Cadastrar"} link`}
      subtitle={
        !isEdit ? "Todos convidados podem visualizar os links importantes." : ""
      }
      content={
        <form onSubmit={createLink} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <Input
              name="title"
              placeholder="Título do link"
              defaultValue={link?.title}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Link2 className="text-zinc-400 size-5" />
              <Input name="url" placeholder="URL" defaultValue={link?.url} />
            </div>
          </div>
          <Button type="submit" size="full" variant="primary">
            Salvar link
          </Button>
        </form>
      }
    />
  );
}
