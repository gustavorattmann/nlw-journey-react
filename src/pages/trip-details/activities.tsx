import { CircleCheck, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreateActivityModal } from "./create-activity-modal";
import { Modal } from "../../components/modal";
import { Button } from "../../components/button";

interface ActivitiesProps {
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

interface Activities {
  date: string;
  activities: {
    id: string;
    title: string;
    occurs_at: string;
  }[];
}

interface Activity {
  id: string;
  title: string;
  occurs_at: string;
}

export function Activities({ trip }: ActivitiesProps) {
  const { tripId } = useParams();

  const [activities, setActivities] = useState<Activities[]>();
  const [activity, setActivity] = useState<Activity | undefined>();
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState<boolean>(false);
  const [isEditActivity, setIsEditActivity] = useState<boolean>(false);
  const [isConfirmation, setIsConfirmation] = useState<boolean>(false);
  const [isReloadActivity, setIsReloadActivity] = useState<boolean>(false);

  function openCreateActivityModalOpen(activity: Activity | undefined) {
    setIsCreateActivityModalOpen(true);
    if (activity) {
      setIsEditActivity(true);
      setActivity(activity);
    }
  }

  function closeCreateActivityModalOpen() {
    setIsCreateActivityModalOpen(false);
    setIsEditActivity(false);
    setActivity(undefined);
  }

  function openCloseModalConfirmation(activity: Activity | undefined) {
    setIsConfirmation(!isConfirmation);
    setActivity(activity);
  }

  function closeAction() {
    setIsConfirmation(false);
  }

  function confirmAction() {
    deleteActivity();
    setActivity(undefined);
  }

  async function deleteActivity() {
    if (activity)
      await api.delete(`/trips/${tripId}/activity/${activity.id}`).then(() => {
        setIsReloadActivity(true);
        openCloseModalConfirmation(undefined);
      });
  }

  useEffect(() => {
    if (tripId || isReloadActivity) {
      api
        .get(`/trips/${tripId}/activities`)
        .then((response) => setActivities(response.data.activities));

      if (isReloadActivity) closeCreateActivityModalOpen();
    }

    setIsReloadActivity(false);
  }, [tripId, isReloadActivity]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Atividades</h2>
        <Button
          onClick={() => openCreateActivityModalOpen(undefined)}
          customClass="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400"
        >
          <Plus className="size-5" />
          Cadastrar atividade
        </Button>
      </div>
      {activities?.map((category) => {
        return (
          <div key={category.date} className="space-y-2">
            <div className="flex gap-2 items-baseline">
              <span className="text-xl text-zinc-300 font-semibold">
                Dia {format(category.date, "d")}
              </span>
              <span className="text-xs text-zinc-500">
                {format(category.date, "EEEE", { locale: ptBR })}
              </span>
            </div>
            {category.activities.length > 0 ? (
              <div className="space-y-2">
                {category.activities.map((item) => {
                  return (
                    <div key={item.id} className={"w-full flex items-center"}>
                      <div
                        onClick={() => openCloseModalConfirmation(item)}
                        className="h-10 px-4 flex items-center rounded-l-xl shadow-shape gap-3 bg-rose-800 hover:bg-rose-600 cursor-pointer"
                      >
                        <Trash className="size-4" />
                      </div>
                      <div className="px-4 py-2 bg-zinc-900 rounded-r-xl shadow-shape flex items-center gap-3 grow">
                        <CircleCheck className="size-5 text-lime-300" />
                        <span className="text-zinc-100 flex items-center gap-2">
                          {item.title}
                          <Pencil
                            onClick={() => openCreateActivityModalOpen(item)}
                            className="size-4 cursor-pointer hover:text-zinc-400"
                          />
                        </span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {format(item.occurs_at, "HH:mm")}h
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-500 text-sm">
                Nenhuma atividade cadastrada nessa data.
              </p>
            )}
          </div>
        );
      })}
      {isCreateActivityModalOpen && (
        <CreateActivityModal
          isEdit={isEditActivity}
          activity={activity}
          trip={trip}
          closeCreateActivityModalOpen={closeCreateActivityModalOpen}
          setIsReloadActivity={setIsReloadActivity}
        />
      )}
      {isConfirmation && (
        <Modal
          type={"confirm"}
          closeAction={closeAction}
          confirmAction={confirmAction}
        />
      )}
    </div>
  );
}
