import { FormEvent, useState } from "react";
import { InviteGuestModal } from "./invite-guest-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsStep } from "./steps/invite-guests-step";
import { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";
import { Modal } from "../../components/modal";

export function CreateTripPage() {
  const [isGuestInputOpen, setIsGuestInputOpen] = useState<boolean>(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] =
    useState<boolean>(false);
  const [destination, setDestination] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>("");
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([
    "diego@rocketseat.com.br",
    "john@acme.com",
  ]);
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
  }>({
    open: false,
    message: "",
  });
  const [error, setError] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });

  function openGuestInput() {
    setIsGuestInputOpen(true);
  }

  function closeGuestInput() {
    setIsGuestInputOpen(false);
  }

  function openGuestModal() {
    setIsGuestModalOpen(true);
  }

  function closeGuestModal() {
    setIsGuestModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function closeSuccessAction() {
    window.document.location.reload();
  }

  function closeErrorAction() {
    setError({ open: false, message: "" });
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) return;
    if (emailsToInvite.includes(email)) return;
    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }

  function removeEmailFromInvite(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove
    );

    setEmailsToInvite(newEmailList);
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading({ open: true, message: "Criando viagem..." });

    if (!destination) return;
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates?.to) return;
    if (emailsToInvite.length === 0) return;
    if (!ownerName || !ownerEmail) return;

    const response = await api.post("/trips", {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    });

    const { tripId } = response.data;

    setLoading({ open: false, message: "" });

    if (tripId) {
      setSuccess({
        open: true,
        message:
          "Acesse sua conta de e-mail para realizar a confirmação da viagem!",
      });
    } else {
      setError({
        open: true,
        message:
          "Não foi possível criar a viagem.\nTente novamente mais tarde!",
      });
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>
        <div className="space-y-4">
          <DestinationAndDateStep
            closeGuestInput={closeGuestInput}
            isGuestInputOpen={isGuestInputOpen}
            openGuestInput={openGuestInput}
            setDestination={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
          />
          {isGuestInputOpen && (
            <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestModal={openGuestModal}
            />
          )}
        </div>
        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda{" "}
          <br />
          com nossos{" "}
          <a className="text-zinc-300 underline" href="#">
            termos de uso
          </a>{" "}
          e{" "}
          <a className="text-zinc-300 underline" href="#">
            políticas de privacidade.
          </a>
        </p>
      </div>
      {isGuestModalOpen && (
        <InviteGuestModal
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          closeGuestModal={closeGuestModal}
          removeEmailFromInvite={removeEmailFromInvite}
        />
      )}
      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          destination={destination}
          eventStartAndEndDates={eventStartAndEndDates}
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
