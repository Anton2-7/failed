import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { StatisticsFilterContext } from "@/providers/StatisticsFilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { StatisticsFilterTable } from "../../StatisticsFilterTable";
import { BASE_URL } from "../../../../static";
import {
  DataGrid,
  DataGridProvider,
  DataGridToolbar,
} from "../../../../components";
import { getStatisticsData } from "./StatisticsData";

export const StatisticsContent = () => {
  const [statistics, setStatistics] = useState([]);
  const { filterOptions, updateStatisticsList } = useContext(
    StatisticsFilterContext
  );
  const [size, setSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  // const { activePage, setTotalPages } = usePagination();
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();

  const fetchStatistics = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };

    // Формируем параметры запроса
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
      ...filters,
    };

    // Получаем данные статистики с сервера
    const statisticsData = await getStatisticsData({ params });

    // Преобразуем данные в нужный формат
    const transformedData = Object.entries(statisticsData.data).map(
      ([date, values]) => ({
        id: date, // Используем дату как уникальный идентификатор
        date: date,
        origin_users: values.registrations.origin_users,
        referal_users: values.registrations.referal_users,
        starts: values.users.starts,
        runs: values.users.runs,
        registrations: values.users.registrations,
        activations: values.users.activations,
        started: values.tasks.started,
        completed: values.tasks.completed,
        received: values.tickets.received,
        spent: values.tickets.spent,
        purshased: values.tickets.purshased,
        primary: values.giveaways.primary,
        repeated: values.giveaways.repeated,
      })
    );

    // Обновляем состояние с количеством страниц и размером страницы
    setTotalPages(statisticsData.total_pages);
    setSize(statisticsData.per_page);

    // Обновляем состояние с преобразованными данными
    setStatistics([...transformedData]);
    console.log(transformedData, "trans");

    return {
      data: transformedData,
      totalCount: statisticsData.total_items,
    };
  };

  useEffect(() => {
    setActivePage(0);
  }, [filterOptions, setActivePage]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.date,
        id: "date",
        header: "",
        columns: [
          {
            accessorKey: "date",
            enableSorting: true,
            header: () => "Дата",
            cell: (info) => {
              const formattedDate = new Date(
                info.row.original.date
              ).toLocaleDateString("ru-RU");
              return <div>{formattedDate}</div>;
            },
          },
        ],
      },
      {
        id: "registrations",
        header: "Регистрации",
        columns: [
          { accessorKey: "origin_users", header: "Прямых" },
          { accessorKey: "referal_users", header: "Реферальных" },
        ],
      },
      {
        id: "users",
        header: "Пользователи",
        columns: [
          { accessorKey: "starts", header: "Старты" },
          { accessorKey: "runs", header: "Запуски" },
          { accessorKey: "registrations", header: "Регистрации" },
          { accessorKey: "activations", header: "Активации" },
        ],
      },
      {
        id: "tasks",
        header: "Задания",
        columns: [
          { accessorKey: "started", header: "Начато" },
          { accessorKey: "completed", header: "Выполнено" },
        ],
      },
      {
        id: "tickets",
        header: "Билеты",
        columns: [
          { accessorKey: "received", header: "Получено" },
          { accessorKey: "spent", header: "Потрачено" },
          { accessorKey: "purshased", header: "Куплено" },
        ],
      },
      {
        id: "contests",
        header: "Конкурсы",
        columns: [
          { accessorKey: "primary", header: "Первичные" },
          { accessorKey: "repeated", header: "Повторное" },
        ],
      },
    ],
    []
  );

  const data = useMemo(() => statistics, [statistics]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Статистика
        </h1>
      </div>

      <StatisticsFilterTable />

      <div className="card card-grid grid h-full min-w-full mt-4 rounded-xl">
        <div className="card-body scrollable-x-auto rounded-xl">
          <DataGrid
            key={`${JSON.stringify(filterOptions)}:${statistics.length}`}
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
            onFetchData={fetchStatistics}
            groupedHeaders={true}
            variant="grouped"
            type="statistics"
          />
        </div>
      </div>
    </div>
  );
};
