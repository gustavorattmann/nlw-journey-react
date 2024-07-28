import { Link2, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-link-modal";

interface Links {
  id: string;
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();

  const [links, setLinks] = useState<Links[]>();
  const [link, setLink] = useState<Links | undefined>();
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isEditLink, setIsEditLink] = useState(false);

  function openCreateLinkModal(link: Links | undefined) {
    setIsCreateLinkModalOpen(true);
    if (link) {
      setIsEditLink(true);
      setLink(link);
    }
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false);
    setIsEditLink(false);
    setLink(undefined);
  }

  async function deleteLink(link: Links | undefined) {
    if (link)
      await api
        .delete(`/trips/${tripId}/links/${link?.id}`)
        .then(() => window.document.location.reload());
  }

  useEffect(() => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setLinks(response.data.links));
  }, [tripId]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>
      <div className="space-y-5">
        {links?.map((link) => {
          return (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Trash
                  onClick={() => deleteLink(link)}
                  className="text-zinc-100 hover:text-zinc-400 size-5 shrink-0 cursor-pointer"
                />
                <div className="space-y-1">
                  <span className="flex items-center gap-2 font-medium text-zinc-100">
                    {link.title}
                    <Pencil
                      onClick={() => openCreateLinkModal(link)}
                      className="size-4 cursor-pointer text-zinc-100 hover:text-zinc-400"
                    />
                  </span>
                  <a
                    href={link.url}
                    className="block text-xs text-zinc-400 truncate hover:text-zinc-200"
                  >
                    {link.url}
                  </a>
                </div>
              </div>
              <Link2 className="text-zinc-400 size-5 shrink-0" />
            </div>
          );
        })}
        {links?.length === 0 && (
          <p className="text-zinc-500 text-sm">Nenhum link cadastrado.</p>
        )}
      </div>
      <Button
        onClick={() => openCreateLinkModal(undefined)}
        variant="secondary"
        size="full"
      >
        <Plus className="size-5" />
        Cadastrar novo link
      </Button>
      {isCreateLinkModalOpen && (
        <CreateLinkModal
          isEdit={isEditLink}
          link={link}
          closeCreateLinkModalOpen={closeCreateLinkModal}
        />
      )}
    </div>
  );
}
