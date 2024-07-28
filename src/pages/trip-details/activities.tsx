import { CircleCheck, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreateActivityModal } from "./create-activity-modal";

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
  const [isEditActivity, setIsEditActivity] = useState(false);

  function openModalEditActivity(activity: Activity) {
    setIsEditActivity(true);
    setActivity(activity);
  }

  function closeModalEditActivity() {
    setIsEditActivity(false);
    setActivity(undefined);
  }

  async function deleteActivity(activity: Activity | undefined) {
    if (activity)
      await api
        .delete(`/trips/${tripId}/activity/${activity.id}`)
        .then(() => window.document.location.reload());
  }

  useEffect(() => {
    api
      .get(`/trips/${tripId}/activities`)
      .then((response) => setActivities(response.data.activities));
  }, [tripId]);

  return (
    <div className="space-y-8">
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
                {category.activities.map((activity) => {
                  return (
                    <div key={activity.id} className="w-full flex items-center">
                      <div
                        onClick={() => deleteActivity(activity)}
                        className="h-10 px-4 flex items-center rounded-l-xl shadow-shape gap-3 bg-rose-800 hover:bg-rose-700 cursor-pointer"
                      >
                        <Trash className="size-4" />
                      </div>
                      <div className="px-4 py-2 bg-zinc-900 rounded-r-xl shadow-shape flex items-center gap-3 grow">
                        <CircleCheck className="size-5 text-lime-300" />
                        <span className="text-zinc-100 flex items-center gap-2">
                          {activity.title}
                          <Pencil
                            onClick={() => openModalEditActivity(activity)}
                            className="size-4 cursor-pointer hover:text-zinc-400"
                          />
                        </span>
                        <span className="text-zinc-400 text-sm ml-auto">
                          {format(activity.occurs_at, "HH:mm")}h
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
      {isEditActivity && (
        <CreateActivityModal
          isEdit={isEditActivity}
          activity={activity}
          trip={trip}
          closeCreateActivityModalOpen={closeModalEditActivity}
        />
      )}
    </div>
  );
}
