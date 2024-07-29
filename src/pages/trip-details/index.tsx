import { useEffect, useState } from "react";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Activities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { ParticipantConfirm } from "./participant-confirm";
import { OwnerConfirm } from "./owner-confirm";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function TripDetailsPage() {
  const { tripId, participantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [trip, setTrip] = useState<Trip | undefined>();
  const [isParticipantConfirm, setIsParticipantConfirm] =
    useState<boolean>(false);
  const [isTripConfirm, setIsTripConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (location.pathname?.includes("confirm")) {
      if (location.pathname?.includes("participants")) {
        setIsParticipantConfirm(true);
      } else {
        setIsTripConfirm(true);
      }
    } else {
      if (tripId)
        api
          .get(`/trips/${tripId}`)
          .then((response) => setTrip(response.data.trip))
          .catch(() => navigate("/"));
    }
  }, [tripId, navigate, location]);

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader trip={trip} />
      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <Activities trip={trip} />
        </div>
        <div className="w-80 space-y-6">
          <ImportantLinks />
          <div className="w-full h-px bg-zinc-800"></div>
          <Guests />
        </div>
      </main>
      {isParticipantConfirm && participantId && (
        <ParticipantConfirm participantId={participantId} />
      )}
      {isTripConfirm && tripId && <OwnerConfirm tripId={tripId} />}
    </div>
  );
}
