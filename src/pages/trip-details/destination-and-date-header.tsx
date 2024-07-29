import { MapPin, Calendar, Settings2, Ban } from "lucide-react";
import { Button } from "../../components/button";
import { useState } from "react";
import { format } from "date-fns";
import { ChangeTripModal } from "./change-trip-modal";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/modal";

interface DestinationAndDateHeaderProps {
  trip:
    | {
        id: string;
        destination: string;
        starts_at: string;
        ends_at: string;
        is_confirmed: boolean;
      }
    | undefined;
}

export function DestinationAndDateHeader({
  trip,
}: DestinationAndDateHeaderProps) {
  const navigate = useNavigate();

  const [isChangeTripModalOpen, setIsChangeTripModalOpen] =
    useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
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

  function openChangeTripModalOpen() {
    setIsChangeTripModalOpen(true);
  }

  function closeChangeTripModalOpen() {
    setIsChangeTripModalOpen(false);
  }

  function openCloseModalConfirmation() {
    setIsConfirmation(!isConfirmation);
  }

  function closeAction() {
    setIsConfirmation(false);
  }

  function confirmAction() {
    cancelTrip();
  }

  function closeSuccessAction() {
    success.action();
    setSuccess({ open: false, message: "", action: () => {} });
  }

  function closeErrorAction() {
    error.action();
    setError({ open: false, message: "", action: () => {} });
  }

  async function cancelTrip() {
    setLoading({ open: true, message: "Aguarde..." });

    await api
      .delete(`/trips/${trip?.id}/cancel`)
      .then(() => {
        setLoading({ open: false, message: "" });
        setSuccess({
          open: true,
          message: "Viagem cancelada com sucesso!",
          action: () => navigate("/"),
        });
      })
      .catch(() => {
        setLoading({ open: false, message: "" });
        setError({
          ...error,
          open: true,
          message:
            "Não foi possível cancelar a viagem.\nTente novamente mais tarde!",
        });
      });
  }

  const displayedDate = trip
    ? `${format(trip.starts_at, "d' de 'LLL")} até ${format(
        trip.ends_at,
        "d' de 'LLL"
      )}`
    : null;

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>
        <div className="w-px h-6 bg-zinc-800"></div>
        <Button onClick={openChangeTripModalOpen} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
        <Button onClick={openCloseModalConfirmation} variant="danger">
          <Ban className="size-5" /> Cancelar viagem
        </Button>
      </div>
      {isChangeTripModalOpen && (
        <ChangeTripModal
          trip={trip}
          closeChangeTripModalOpen={closeChangeTripModalOpen}
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
