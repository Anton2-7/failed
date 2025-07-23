import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DataGrid, KeenIcon } from "@/components";
import { MailingFilterContext } from "@/providers/MailingFilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { Tooltip } from "antd";
import { getMailingData, deleteMailing } from "./MailingData";
import { MailingFilterTable } from "../../MailingFilterTable";
import { BASE_URL } from "../../../../static";
import axios from "axios";

const statusLabels = {
  true: "Активна",
  false: "Приостановлена",
};

const typeLabels = {
  one_time: "Разовая",
  trigger: "Регулярная",
};

export const MailingContent = () => {
  const [mailing, setMailing] = useState([]);
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const { filterOptions, updateMailingList } = useContext(MailingFilterContext);

  const fetchMailing = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
      ...filters,
    };

    const mailingTestData = await getMailingData({ params });

    setTotalPages(mailingTestData.total_pages);
    setSize(mailingTestData.per_page);
    setMailing(mailingTestData.items);
    console.log(mailingTestData.items, "statistics");

    return {
      data: mailingTestData.items,
      totalCount: mailingTestData.total_items,
    };
  };

  useEffect(() => {
    if (filterOptions) {
      setActivePage(0);
    }
  }, [filterOptions]);

  const handleDelete = async (mailingId) => {
    try {
      await deleteMailing(mailingId);
      updateMailingList(filterOptions, activePage + 1);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  const [giveaways, setGiveaways] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Функция для загрузки данных о конкурсах
  const fetchGiveaways = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/info/giveaways`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      // Если структура — массив объектов { id, name }
      const items = Array.isArray(response.data)
        ? response.data.map((g) => ({
            id: g.id,
            name: g.name,
          }))
        : [];

      setGiveaways(items);
    } catch (error) {
      console.error("Ошибка при загрузке конкурсов:", error);
      setGiveaways([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/info/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      // Новый формат: [{ id, name }]
      const items = Array.isArray(response.data)
        ? response.data.map((t) => ({
            id: t.id,
            title: t.name,
          }))
        : [];

      setTasks(items);
    } catch (error) {
      console.error("Ошибка при загрузке заданий:", error);
      setTasks([]);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchGiveaways();
    fetchTasks();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.id,
        id: "id",
        enableSorting: true,
        header: () => "ID",
        cell: (info) => (
          <div className="text-center">{info.row.original.id}</div>
        ),
        meta: {
          className: "text-center",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Дата созд.",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.created_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "text-center min-w-[112px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      // {
      //   accessorFn: (row) => row.shedulet_at,
      //   id: "shedulet_at",
      //   header: () => "Дата провед.",
      //   cell: (info) => {
      //     const formattedDate = new Date(
      //       info.row.original.shedulet_at
      //     ).toLocaleDateString("ru-RU");
      //     return <div className="text-center">{formattedDate}</div>;
      //   },
      //   meta: {
      //     className: "text-center min-w-[112px]",
      //     cellClassName: "min-w-[120px] text-gray-800 font-normal",
      //   },
      // },
      {
        accessorFn: (row) => (row.name, row.title),
        id: "name",
        header: () => "Название",
        cell: (info) => {
          const { name, photo } = info.row.original;
          const imageUrl = photo;

          return (
            <Tooltip
              placement="bottom"
              color={"white"}
              overlayInnerStyle={{ color: "black" }}
              title={info.row.original.title}
            >
              <div className="flex items-center gap-2 min-w-[330px]">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-10 h-10 object-contain rounded-full border border-[#DBDFE9]"
                  />
                )}
                <div>{name}</div>
              </div>
            </Tooltip>
          );
        },
        meta: {
          className: "",
          cellClassName: "w-1/2 text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.button_url,
        id: "button_url",
        header: () => "Ссылка",
        cell: (info) => (
          <div className="min-w-[330px]">
            <a
              className=" text-primary underline"
              href={info.row.original.button_url}
              target="_blank"
            >
              {info.row.original.button_url}
            </a>
          </div>
        ),
      },

      {
        accessorFn: (row) => row.type,
        id: "type",
        header: () => "Тип",
        cell: (info) => {
          const type = info.row.original.type;
          const triggers = info.row.original.triggers;

          // Получаем название конкурса по ID
          const getTaskName = (id) => {
            const task = tasks.find((task) => String(task.id) === String(id));
            return task ? task.title : `${id}`;
          };

          const getGiveawayName = (id) => {
            const giveaway = giveaways.find((g) => String(g.id) === String(id));
            return giveaway ? giveaway.name : `${id}`;
          };

          const renderTriggerParams = (trigger) => {
            if (!trigger.trigger_params) return null;

            const { trigger_params } = trigger;

            switch (trigger.name) {
              case "Не заходил Х дней":
                return `Не заходил ${trigger_params.inactive_days} дней`;
              case "Не тратил билеты Х дней":
                return `Не тратил билеты ${trigger_params.inactive_days} дней`;
              case "Не выполнил задание":
                const taskName = getTaskName(trigger_params.task_id); // Получаем название задания
                return `Не выполнил ${taskName}`;
              case "До конца конкурса осталось времени":
                const giveawayName = getGiveawayName(
                  trigger_params.giveaway_id
                ); // Получаем название конкурса
                return `До конца ${giveawayName} осталось ${trigger_params.time}`;
              case "Не участвовал в конкурсe":
                const giveawayName2 = getGiveawayName(
                  trigger_params.giveaway_id
                ); // Получаем название конкурса
                return `Не участвовал в ${giveawayName2}`;
              default:
                return Object.entries(trigger_params)
                  .map(([key, value]) => `${key}: ${String(value)}`)
                  .join(", ");
            }
          };

          const renderTriggers = () => {
            if (!Array.isArray(triggers) || triggers.length === 0)
              return "Нет триггеров";

            return (
              <div>
                {triggers.map((trigger) => (
                  <div key={trigger.id}>
                    •{" "}
                    {trigger.trigger_params
                      ? renderTriggerParams(trigger)
                      : trigger.name}
                  </div>
                ))}
              </div>
            );
          };

          return (
            <div>
              {type === "trigger" ||
              type === "one_time" ||
              type === "regular" ? (
                <Tooltip
                  placement="bottom"
                  overlayInnerStyle={{ color: "black" }}
                  overlayClassName="custom-tooltip"
                  title={renderTriggers()}
                  color="white"
                >
                  <div>{typeLabels[type]}</div>
                </Tooltip>
              ) : (
                <div>{typeLabels[type]}</div>
              )}
            </div>
          );
        },
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.is_active,
        id: "is_active",
        header: () => "Статус",
        cell: (info) => (
          <div className="min-w-[330px]">
            {statusLabels[info.row.original.is_active]}
          </div>
        ),
      },
      {
        accessorFn: (row) => (row.sent, row.received),
        id: "sent/received",
        header: () => "Отправл./получ.",
        cell: (info) => (
          <div className="text-center min-w-[110px]">
            {info.row.original.sent} / <b>{info.row.original.received}</b>
          </div>
        ),
        meta: {
          className: "min-w-[131px] text-center",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => (
          <div className="flex gap-6 justify-center">
            {/* <button
              className="ki-filled text-2xl text-danger"
              onClick={() => handleDelete(info.row.original.id)}
            >
              <KeenIcon icon={"trash"} />
            </button> */}
            <Link
              to={`/mailing/create-update-mailing/${info.row.original.id}`}
              state={{ mailingItem: info.row.original }}
            >
              <button className="ki-filled text-2xl text-primary">
                <KeenIcon icon={"setting-2"} />
              </button>
            </Link>
          </div>
        ),
        meta: {
          className: "text-center",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    [mailing]
  );

  const data = useMemo(() => mailing, [mailing]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Рассылки
        </h1>
        <Link
          className="btn-sm lg:btn-lg btn btn-primary"
          to="/mailing/create-update-mailing"
        >
          Добавить рассылку
        </Link>
      </div>
      <div>
        <MailingFilterTable />
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Рассылки</h3>
        </div>
        <div className="card-body">
          <DataGrid
            key={JSON.stringify(filterOptions)}
            columns={columns}
            data={data}
            rowSelect={true}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            filters={filterOptions}
            onFetchData={fetchMailing}
          />
        </div>
      </div>
    </div>
  );
};
