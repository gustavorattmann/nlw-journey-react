import { Link2, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "../../components/button";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-link-modal";
import { Modal } from "../../components/modal";

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
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [isReloadLink, setIsReloadLink] = useState<boolean>(false);
  const [isEditLink, setIsEditLink] = useState(false);
  const [loading, setLoading] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [success, setSuccess] = useState<{
    open: boolean;
    message: string;
    action: () => void;
  }>({
    open: false,
    message: "",
    action: () => {},
  });
  const [error, setError] = useState<{
    open: boolean;
    message: string;
    action: () => void;
  }>({
    open: false,
    message: "",
    action: () => {},
  });

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

  function openCloseModalConfirmation(link: Links | undefined) {
    setIsConfirmation(!isConfirmation);
    setLink(link);
  }

  function closeAction() {
    setIsConfirmation(false);
  }

  function confirmAction() {
    deleteLink();
    setLink(undefined);
  }

  function closeSuccessAction() {
    success.action();
    setSuccess({ open: false, message: "", action: () => {} });
  }

  function closeErrorAction() {
    error.action();
    setError({ open: false, message: "", action: () => {} });
  }

  async function deleteLink() {
    if (link) setLoading({ open: true, message: "Aguarde..." });

    await api
      .delete(`/trips/${tripId}/links/${link?.id}`)
      .then(() => {
        setIsReloadLink(true);
        openCloseModalConfirmation(undefined);
        setLoading({ open: false, message: "" });
        setSuccess({
          ...success,
          open: true,
          message: "Link removido com sucesso!",
        });
      })
      .catch(() => {
        setLoading({ open: false, message: "" });
        setError({
          ...error,
          open: true,
          message: "Não foi possível remover o link!",
        });
      });
  }

  useEffect(() => {
    if (tripId || isReloadLink) {
      api
        .get(`/trips/${tripId}/links`)
        .then((response) => setLinks(response.data.links));

      if (isReloadLink) closeCreateLinkModal();
    }

    setIsReloadLink(false);
  }, [tripId, isReloadLink]);

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
                  onClick={() => openCloseModalConfirmation(link)}
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
          setIsReloadLink={setIsReloadLink}
          closeCreateLinkModalOpen={closeCreateLinkModal}
          success={success}
          error={error}
          setLoading={setLoading}
          setSuccess={setSuccess}
          setError={setError}
        />
      )}
      {isConfirmation && (
        <Modal
          type="confirm"
          closeAction={closeAction}
          confirmAction={confirmAction}
        />
      )}
      {loading.open && <Modal type="loading" text={loading.message} />}
      {success.open && (
        <Modal
          type="success"
          text={success.message}
          closeAction={closeSuccessAction}
        />
      )}
      {error.open && (
        <Modal
          type="error"
          text={error.message}
          closeAction={closeErrorAction}
        />
      )}
    </div>
  );
}
