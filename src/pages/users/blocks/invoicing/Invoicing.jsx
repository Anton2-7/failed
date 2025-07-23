/* eslint-disable prettier/prettier */
import { useEffect, useState, useMemo, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { getUsersData } from "./";
import { ModalContext } from "@/providers/ModalProvider";
import { FilterContext } from "@/providers/FilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { FilterTabel } from "../../FilterTabel";

const Invoicing = () => {
  const [emptyTrigger, setEmptyTrigger] = useState(0);

  const { activePage, setActivePage, totalPages, setTotalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const { filterOptions, updateUserList, newListUsers } =
    useContext(FilterContext);
  const { openModal, isModalOpen } = useContext(ModalContext);
  const [users, setUsers] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { setRefreshTrigger } = useContext(ModalContext);

  useEffect(() => {
    // Устанавливаем в контекст функцию, которую можно будет вызвать из модалки
    setRefreshTrigger(() => () => setRefreshCounter((prev) => prev + 1));
  }, []);

  const fetchUsers = async ({ pageIndex, pageSize, filters, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      ...filters,
    };
    // Добавляем параметры сортировки только если есть поле для сортировки
    if (sortingParams.id) {
      params.order_by = sortingParams.id;
      params.order_direction = sortingParams.desc ? "desc" : "asc";
    } else {
      // По умолчанию сортируем по user_id в убывающем порядке
      params.order_by = "user_id";
      params.order_direction = "desc";
    }
    const usersData = await getUsersData({ params });

    setTotalPages(usersData.total_pages);
    setSize(usersData.per_page);
    setUsers(usersData.items);
    if (usersData.items.length === 0 && users.length !== 0) {
      setEmptyTrigger((prev) => prev + 1);
    }

    return {
      data: usersData.items,
      totalCount: usersData.total_items,
    };
  };

  useEffect(() => {
    if (filterOptions) {
      setActivePage(0);
    }
  }, [filterOptions]);

  useEffect(() => {
    console.log(isModalOpen, "isModalOpen");

    if (isModalOpen === false) {
      setTimeout(() => {
        fetchUsers(1);
      }, 500);
    }
  }, [isModalOpen]);

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.user_id,
        id: "user_id",
        header: () => "ID",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                {info.row.original.gs_subscription === "PRO" ? (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#04B440",
                    }}
                  ></span>
                ) : info.row.original.gs_subscription === "LITE" ? (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#DFA000",
                    }}
                  ></span>
                ) : info.row.original.gs_subscription === "FULL" ? (
                  <>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#DFA000",
                      }}
                    ></span>
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#04B440",
                      }}
                    ></span>
                  </>
                ) : (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#DBDFE9",
                    }}
                  ></span>
                )}
              </div>

              <div> {info.row.original.id}</div>
            </div>
          );
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.gs_id,
        id: "gs_id",
        header: () => "GS ID",
        cell: (info) => {
          const handleClick = () => {
            openModal("userSettings", info.row.original.id, "users");
          };
          return (
            <div
              className="text-primary cursor-pointer min-w-[40px]"
              onClick={handleClick}
            >
              {info.row.original.gs_id}
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
        },
      },
      {
        accessorFn: (row) => row.created_at,
        id: "created_at",
        header: () => "Дата рег.",
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.created_at
          ).toLocaleDateString("ru-RU");
          return <div className="min-w-[110px]">{formattedDate}</div>;
        },
        meta: {
          className: "min-w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.tg_id,
        id: "tg_id",
        header: () => "Telegram",
        cell: (info) => {
          return info.row.original.username ? (
            <div className="min-w-[219px]">@{info.row.original.username}</div>
          ) : info.row.original.tg_id ? (
            <div className="min-w-[219px]">id{info.row.original.tg_id}</div>
          ) : (
            <div className="min-w-[219px]">-</div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.phone,
        id: "vk",
        header: () => "VK",
        cell: (info) => {
          return (
            <div className="min-w-[151px] flex items-center justify-start gap-2">
              {/* <KeenIcon icon={"phone"} /> */}
              <span className="text-md ki-filled ki-exit-right-corner text-[#99A1B7]" />
              <div>
                {info.row.original.vk_id !== null ? (
                  <div className="text-primary">
                    id{info.row.original.vk_id}
                  </div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.phone,
        id: "phone",
        header: () => "Телефон",
        cell: (info) => {
          return (
            <div className="min-w-[151px] flex items-center justify-start gap-2">
              {/* <KeenIcon icon={"phone"} /> */}
              <span className="text-md ki-filled ki-phone text-[#99A1B7]" />
              <div>
                {info.row.original.phone !== null ? (
                  <div className="text-primary">{info.row.original.phone}</div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => {
          return (
            <div className="min-w-[241px] flex items-center justify-start gap-2">
              <span className="text-md ki-filled ki-sms text-[#99A1B7]" />
              {/* <KeenIcon icon={"sms"} /> */}
              <div>
                {info.row.original.email !== null ? (
                  <div className="text-primary">{info.row.original.email}</div>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.balance,
        id: "balance",
        header: () => "Баланс",
        cell: (info) => {
          return <div className="">{info.row.original.balance}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.giveaways_count,
        id: "giveaways_count",
        header: () => "Конкурсы",
        cell: (info) => {
          return <div className="">{info.row.original.giveaways_count}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.completed_tasks,
        id: "completed_tasks",
        header: () => "Заданий",
        cell: (info) => {
          return <div className="">{info.row.original.completed_tasks}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.referals_count,
        id: "referals_count",
        header: () => "Рефералов",
        cell: (info) => {
          return <div className="">{info.row.original.referals_count}</div>;
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },

      {
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => {
          const handleClick = () => {
            openModal("userSettings", info.row.original.id, "users");
          };
          return (
            <div
              className=" flex items-center justify-center"
              onClick={handleClick}
            >
              <button className="ki-filled text-[x-large] text-primary">
                <KeenIcon icon={"setting-2"} />
              </button>
              {info.row.original.settings}
            </div>
          );
        },
        meta: {
          className: "w-[170px] cursor-pointer",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    []
  );
  console.log("users", users);

  const data = useMemo(() => users, [users]);

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Пользователи
        </h1>
      </div>
      <div>
        <FilterTabel />
      </div>
      <div className="card card-grid min-w-full">
        <div className="card-header">
          <h3 className="card-title">Список пользователей</h3>
        </div>
        <div className="card-body">
          <DataGrid
            key={`${JSON.stringify(filterOptions)}-${refreshCounter}-${emptyTrigger}`}
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
            onFetchData={fetchUsers}
            sorting={[{ id: "user_id", desc: true }]}
          />
        </div>
      </div>
    </div>
  );
};
export { Invoicing };
