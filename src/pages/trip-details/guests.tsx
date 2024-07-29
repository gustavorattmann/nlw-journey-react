import { CheckCircle2, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { InviteGuestModal } from "../create-trip/invite-guest-modal";

interface Participants {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
  is_owner: boolean;
}

export function Guests() {
  const { tripId } = useParams();

  const [participants, setParticipants] = useState<Participants[]>();
  const [isReloadParticipants, setIsReloadParticipants] =
    useState<boolean>(false);
  const [isEditGuest, setIsEditGuest] = useState(false);

  function openCloseEditGuestModal() {
    setIsEditGuest(!isEditGuest);
  }

  useEffect(() => {
    api
      .get(`/trips/${tripId}/participants`)
      .then((response) => setParticipants(response.data.participants));

    setIsReloadParticipants(false);
  }, [tripId, isReloadParticipants]);

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>
      <div className="space-y-5">
        {participants?.map((participant, index) => {
          return (
            <div
              key={participant.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="block font-medium text-zinc-100">
                  {participant.name ?? `Convidado ${index}`}
                </span>
                <span className="block text-sm text-zinc-400 truncate">
                  {participant.email}
                </span>
              </div>
              {participant.is_confirmed ? (
                <CheckCircle2 className="text-green-400 size-5 shrink-0" />
              ) : (
                <CircleDashed className="text-zinc-400 size-5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
      <Button onClick={openCloseEditGuestModal} variant="secondary" size="full">
        <UserCog className="size-5" />
        Gerenciar convidados
      </Button>
      {isEditGuest && (
        <InviteGuestModal
          isEdit={isEditGuest}
          tripId={tripId}
          participants={participants}
          closeGuestModal={openCloseEditGuestModal}
          setIsReloadParticipants={setIsReloadParticipants}
        />
      )}
    </div>
  );
}
