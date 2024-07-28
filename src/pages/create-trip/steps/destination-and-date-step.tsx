import { ArrowRight, Calendar, MapPin, Settings2 } from "lucide-react";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { useEffect, useState } from "react";
import { Modal } from "../../../components/modal";
import { DateRange, DayPicker } from "react-day-picker";
import { add, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface DestinationAndDateStepProps {
  isGuestInputOpen: boolean;
  eventStartAndEndDates: DateRange | undefined;
  closeGuestInput: () => void;
  openGuestInput: () => void;
  setDestination: (destination: string) => void;
  setEventStartAndEndDates: (dates: DateRange | undefined) => void;
}

export function DestinationAndDateStep({
  closeGuestInput,
  isGuestInputOpen,
  eventStartAndEndDates,
  openGuestInput,
  setDestination,
  setEventStartAndEndDates,
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }

  const displayedDate =
    eventStartAndEndDates?.from && eventStartAndEndDates?.to
      ? `${format(eventStartAndEndDates.from, "d' de 'LLL")} até ${format(
          eventStartAndEndDates.to,
          "d' de 'LLL"
        )}`
      : null;

  useEffect(() => {
    if (eventStartAndEndDates?.from && eventStartAndEndDates?.to)
      closeDatePicker();
  }, [eventStartAndEndDates]);

  return (
    <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <Input
          onChange={(event) => setDestination(event.target.value)}
          disabled={isGuestInputOpen}
          placeholder="Para onde você vai?"
        />
      </div>
      <Button
        onClick={openDatePicker}
        disabled={isGuestInputOpen}
        customClass="flex items-center gap-2 text-left"
      >
        <Calendar className="size-5 text-zinc-400" />
        <span className="text-zinc-400 text-lg flex-1">
          {displayedDate || "Quando?"}
        </span>
      </Button>
      {isDatePickerOpen && (
        <Modal
          closeAction={closeDatePicker}
          customClass="w-auto"
          title="Selecione a data"
          content={
            <DayPicker
              locale={ptBR}
              mode="range"
              selected={eventStartAndEndDates}
              onSelect={setEventStartAndEndDates}
              disabled={{ before: add(new Date(), { days: 1 }) }}
            />
          }
        />
      )}
      <div className="w-px h-6 bg-zinc-800"></div>
      {isGuestInputOpen ? (
        <Button onClick={closeGuestInput} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      ) : (
        <Button onClick={openGuestInput} variant="primary">
          Continuar
          <ArrowRight className="size-5" />
        </Button>
      )}
    </div>
  );
}
