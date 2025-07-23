import React, { useMemo, useState, useEffect, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { getTasksData, deleteTask, swapTasksPosition } from "./TasksData";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../../static";
import { TasksFilterTable } from "../../TasksFilterTable";
import { TasksFilterContext } from "@/providers/TasksFilterProvider";
import { usePagination } from "@/providers/PaginationContext";

const statusLabels = {
  true: "Активно",
  false: "Остановлено",
};

const checkTypeLabels = {
  auto: "Автоматически",
  handle: "Ручной",
  timer: "Таймер",
  postback: "Постбэк",
};

export const TasksContent = () => {
  const navigate = useNavigate();
  const [giveawayNames, setGiveawayNames] = useState({});
  const [tasks, setTasks] = useState([]);
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const {
    filterOptions = {},
    newListTasks,
    updateTasksList,
  } = useContext(TasksFilterContext);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTasks = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
      ...filters,
    };
    console.log(sortingParams, "sorting");

    const tasksData = await getTasksData({ params });

    setTotalPages(tasksData.total_pages);
    setSize(tasksData.per_page);
    setTasks(tasksData.items);

    // Сбор ID конкурсов
    const giveawayIds = tasksData.items
      .map((task) => task.giveaway_id)
      .filter(Boolean);

    // Загрузка названий конкурсов
    fetchGiveawayNames(giveawayIds);

    return {
      data: tasksData.items,
      totalCount: tasksData.total_items,
    };
  };

  const fetchGiveawayNames = async (giveawayIds) => {
    const newGiveawayNames = {};

    // Убираем дубликаты и фильтруем уже загруженные
    const uniqueIdsToFetch = giveawayIds.filter(
      (id) => id && !giveawayNames[id]
    );

    await Promise.all(
      uniqueIdsToFetch.map(async (id) => {
        try {
          const response = await axios.get(`${BASE_URL}/giveaways/${id}`);
          newGiveawayNames[id] = response.data.name;
        } catch (error) {
          console.error(
            `Ошибка при получении названия конкурса с ID ${id}:`,
            error
          );
          newGiveawayNames[id] = "Неизвестный конкурс";
        }
      })
    );

    // Объединяем с уже существующими
    setGiveawayNames((prev) => ({ ...prev, ...newGiveawayNames }));
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      updateTasksList(filterOptions, activePage + 1);
      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  // Добавляем обработчик смены позиции
  const handleSwap = async (index, direction, tasksData) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasksData.length) return;
    const firstId = tasksData[index].id;
    const secondId = tasksData[targetIndex].id;
    try {
      await swapTasksPosition(firstId, secondId);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("Не удалось поменять позиции заданий", e);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.task_id,
        id: "task_id",
        enableSorting: true,
        header: () => "ID",
        cell: (info) => <div>{info.row.original.id}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Дата создания",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.created_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "",
        },
      },
      {
        accessorFn: (row) => row.title,
        id: "title",
        header: () => "Название",
        cell: (info) => {
          const { title, photo, giveaway_id } = info.row.original;
          const imageUrl =
            photo && (photo.startsWith("http") ? photo : `http://${photo}`);

          return (
            <div className="flex items-center gap-2 min-w-[300px]">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-10 h-10 object-contain rounded-full border border-[#DBDFE9]"
                />
              )}
              <div>{title}</div>
            </div>
          );
        },
        meta: {
          className: "w-full",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.reward,
        id: "reward",
        header: () => "Награда",
        cell: (info) => (
          <div className="flex gap-1 min-w-[300px]">
            {info.row.original.reward}{" "}
            {info.row.original.giveaway_id && (
              <div>
                +
                <Link
                  to={`/giveaways/settings-giveaway/${info.row.original.giveaway_id}`}
                  className="text-primary"
                >
                  {` Участие в конкурсе ID:${info.row.original.giveaway_id} 
                    "${giveawayNames[info.row.original.giveaway_id]}"`}
                  {/* {giveawayNames[giveaway_id] &&
                      ` "${giveawayNames[giveaway_id]}"`} */}
                </Link>
              </div>
            )}
          </div>
        ),
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.started,
        id: "started",
        header: () => "Начато",
        cell: (info) => <div>{info.row.original.started}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.completed,
        id: "completed",
        header: () => "Выполнено",
        cell: (info) => <div>{info.row.original.completed}</div>,
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.check_type,
        id: "check_type",
        header: () => "Тип проверки",
        cell: (info) => (
          <div className="min-w-[110px]">
            {checkTypeLabels[info.row.original.check_type]}
          </div>
        ),
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        enableSorting: true,
        header: () => "Статус",
        cell: (info) => <div>{statusLabels[info.row.original.is_active]}</div>,
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.position,
        id: "position",
        header: () => "Порядок",
        cell: (info) => {
          return (
            <div className="flex gap-6 justify-center items-center">
              <button
                className="ki-filled text-2xl opacity-30 disabled:opacity-15"
                onClick={() =>
                  handleSwap(
                    info.row.index,
                    "up",
                    info.table.getCoreRowModel().rows.map((row) => row.original)
                  )
                }
                disabled={info.row.index === 0}
                title="Вверх"
              >
                <KeenIcon icon={"up-square"} />
              </button>
              <button
                className="ki-filled text-2xl opacity-30 disabled:opacity-15"
                onClick={() =>
                  handleSwap(
                    info.row.index,
                    "down",
                    info.table.getCoreRowModel().rows.map((row) => row.original)
                  )
                }
                disabled={
                  info.row.index ===
                  info.table.getCoreRowModel().rows.length - 1
                }
                title="Вниз"
              >
                <KeenIcon icon={"down-square"} />
              </button>
            </div>
          );
        },
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.actions,
        id: "actions",
        header: () => "Действия",
        cell: (info) => {
          const taskId = info.row.original.id;
          const handleDownload = async () => {
            try {
              const response = await axios.get(
                `${BASE_URL}/tasks/participants/report/${taskId}`,
                {
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                    Accept:
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  },
                }
              );
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `participants_report_${taskId}.xlsx`
              );
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Ошибка при скачивании файла:", error);
              alert("Не удалось скачать файл");
            }
          };

          return (
            <div className="flex gap-3 justify-center">
              {/* <button
                className="ki-filled text-2xl text-danger"
                onClick={() => handleDelete(info.row.original.id)}
              >
                <KeenIcon icon={"trash"} />
              </button> */}
              <button
                className="ki-filled text-2xl text-primary"
                onClick={handleDownload}
              >
                <KeenIcon icon={"file-down"} />
                {info.row.original.participants}
              </button>
              <Link
                to={`/tasks/create-update-tasks/${info.row.original.id}`}
                state={{ taskItem: info.row.original }}
              >
                <button className="ki-filled text-2xl text-primary">
                  <KeenIcon icon={"setting-2"} />
                </button>
              </Link>
            </div>
          );
        },
        meta: {
          className: "w-1/6",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    [tasks, giveawayNames]
  );

  const data = useMemo(() => tasks, [tasks]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Задания
        </h1>
        <Link
          className="btn-sm lg:btn-lg btn btn-primary"
          to="/tasks/create-update-tasks"
        >
          Добавить задание
        </Link>
      </div>
      <div>
        <TasksFilterTable />
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Задания</h3>
        </div>
        <div className="card-body">
          <DataGrid
            key={`datagrid-${refreshKey}-${JSON.stringify(filterOptions)}`}
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
            onFetchData={fetchTasks}
            sorting={[{ id: "position", desc: false }]}
          />
        </div>
      </div>
    </div>
  );
};
