import { Calendar, MapPin } from "lucide-react";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Modal } from "../../components/modal";
import { useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";

interface ChangeTripModalProps {
  trip:
    | {
        id: string;
        destination: string;
        starts_at: string;
        ends_at: string;
        is_confirmed: boolean;
      }
    | undefined;
  closeChangeTripModalOpen: () => void;
}

export function ChangeTripModal({
  trip,
  closeChangeTripModalOpen,
}: ChangeTripModalProps) {
  const { tripId } = useParams();

  const initialRange: DateRange = {
    from: trip?.starts_at ? new Date(trip.starts_at) : undefined,
    to: trip?.ends_at ? new Date(trip.ends_at) : undefined,
  };

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [destination, setDestination] = useState(trip?.destination || "");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >(initialRange);

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }

  async function changeTrip() {
    if (!destination) return;
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) return;

    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
    });

    window.document.location.reload();
  }

  const displayedDate =
    eventStartAndEndDates?.from && eventStartAndEndDates?.to
      ? `${format(eventStartAndEndDates.from, "d' de 'LLL")} até ${format(
          eventStartAndEndDates.to,
          "d' de 'LLL"
        )}`
      : null;

  return (
    <Modal
      closeAction={closeChangeTripModalOpen}
      title="Alterar viagem"
      content={
        <>
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <MapPin className="size-5 text-zinc-400" />
            <Input
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Para onde você vai?"
              value={destination}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <button
                onClick={openDatePicker}
                className="flex items-center gap-2 text-left]"
              >
                <Calendar className="size-5 text-zinc-400" />
                <span className="text-zinc-400 text-lg flex-1">
                  {displayedDate || "Quando?"}
                </span>
              </button>
              {isDatePickerOpen && (
                <Modal
                  closeAction={closeDatePicker}
                  customClass="w-auto"
                  title="Selecione a data"
                  content={
                    <DayPicker
                      mode="range"
                      selected={eventStartAndEndDates}
                      onSelect={setEventStartAndEndDates}
                    />
                  }
                />
              )}
            </div>
          </div>
          <Button onClick={changeTrip} size="full">
            Confirmar
          </Button>
        </>
      }
    />
  );
}
