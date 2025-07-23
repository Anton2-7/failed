import { useMemo } from "react";
import GiveawayTooltip from "../blocks/giveawayContent/GiveawayTooltip";
import { Link } from "react-router-dom";
import { KeenIcon } from "../../../components";

const statusLabels = {
  true: "Активен",
  false: "Приостановлен",
};

export default function useGiveawayColumns() {
  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.id,
        id: "id",
        header: () => "ID",
        enableSorting: true,
        cell: (info) => <div>{info.row.original.id}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.start_date,
        id: "start_date",
        header: () => "Дата рег.",
        enableSorting: true,
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.start_date
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
      },
      {
        accessorFn: (row) => row.number,
        id: "number",
        header: () => "Номер конкурса",
        cell: (info) => (
          <div className="min-w-[110px]">{info.row.original.number}</div>
        ),
      },
      {
        accessorFn: (row) => row.period_days,
        id: "period_days",
        header: () => "Длительность",
        cell: (info) => {
          const { period_days } = info.row.original;
          if (period_days) {
            return <div>{period_days} дней</div>;
          }
        },
      },
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Конкурс",
        cell: (info) => {
          const giveaway = info.row.original;
          return (
            <div className="flex justify-between w-full min-w-[300px]">
              <div className="max-w-[300px] overflow-hidden text-ellipsis line-clamp-2">
                {giveaway.name}
              </div>
              <GiveawayTooltip giveaway={giveaway} />
            </div>
          );
        },
        meta: {
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.participants_count,
        id: "participants_count",
        header: () => "Участников",
        cell: (info) => <div>{info.row.original.participants_count}</div>,
        meta: {
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.price,
        id: "price",
        header: () => "Стоимость",
        cell: (info) => <div>{info.row.original.price}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.active,
        id: "active",
        header: () => "Статус",
        enableSorting: true,
        cell: (info) => {
          const { active } = info.row.original;
          // return active === "Идет" ? "Активен" : "Ожидается";
          return statusLabels[active];
          // return active;
        },
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              <button className=" ki-filled text-[x-large] text-primary">
                <Link
                  to={`/giveaways/settings-giveaway/${info.row.original.id}`}
                  state={{ giveawayId: info.row.original.id }}
                >
                  <KeenIcon icon={"setting-2"} />
                  {info.row.original.settings}
                </Link>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return { columns };
}
