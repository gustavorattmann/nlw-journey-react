import { useEffect, useState } from "react";
import { Modal } from "../../components/modal";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

interface ParticipantConfirmProps {
  participantId: string;
}

export function ParticipantConfirm({ participantId }: ParticipantConfirmProps) {
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  function closeAction() {
    cancelPresence();
    setIsConfirmation(false);
  }

  function confirmAction() {
    confirmPresence();
  }

  function confirmPresence() {
    api.get(`/participants/${participantId}/confirm`).then(() => navigate("/"));
  }

  function cancelPresence() {
    api
      .delete(`/participants/${participantId}/rejects`)
      .then(() => navigate("/"));
  }

  useEffect(() => {
    setIsConfirmation(true);
  }, []);

  return (
    isConfirmation && (
      <Modal
        type="invite"
        closeAction={closeAction}
        confirmAction={confirmAction}
      />
    )
  );
}
