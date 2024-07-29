import { useEffect, useState } from "react";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

interface OwnerConfirmProps {
  tripId: string;
}

export function OwnerConfirm({ tripId }: OwnerConfirmProps) {
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  function closeAction() {
    setIsConfirmation(false);
    navigate("/");
  }

  function confirmAction() {
    confirmPresence();
  }

  function confirmPresence() {
    api.get(`/trips/${tripId}/confirm`).then(() => navigate("/"));
  }

  useEffect(() => {
    setIsConfirmation(true);
  }, []);

  return (
    isConfirmation && (
      <Modal
        type="confirm"
        closeAction={closeAction}
        confirmAction={confirmAction}
      />
    )
  );
}
