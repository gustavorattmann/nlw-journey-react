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
}

export function CreateLinkModal({
  isEdit,
  link,
  closeCreateLinkModalOpen,
}: CreateLinkModalProps) {
  const { tripId } = useParams();

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();

    if (isEdit) {
      await api.put(`/trips/${tripId}/links/${link?.id}`, {
        title,
        url,
      });
    } else {
      await api.post(`/trips/${tripId}/links`, {
        title,
        url,
      });
    }

    window.document.location.reload();
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
