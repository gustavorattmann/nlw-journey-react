import { MapPin, Calendar, Settings2, Ban } from "lucide-react";
import { Button } from "../../components/button";
import { useState } from "react";
import { format } from "date-fns";
import { ChangeTripModal } from "./change-trip-modal";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

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

  const [isChangeTripModalOpen, setIsChangeTripModalOpen] = useState(false);

  function openChangeTripModalOpen() {
    setIsChangeTripModalOpen(true);
  }

  function closeChangeTripModalOpen() {
    setIsChangeTripModalOpen(false);
  }

  async function cancelTrip() {
    await api.delete(`/trips/${trip?.id}/cancel`).then(() => navigate("/"));
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
        <Button onClick={cancelTrip} variant="danger">
          <Ban className="size-5" /> Cancelar viagem
        </Button>
      </div>
      {isChangeTripModalOpen && (
        <ChangeTripModal
          trip={trip}
          closeChangeTripModalOpen={closeChangeTripModalOpen}
        />
      )}
    </div>
  );
}
