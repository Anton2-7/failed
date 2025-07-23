/* eslint-disable prettier/prettier */
import { useEffect, useState, useMemo, useContext } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { ModalContext } from "@/providers/ModalProvider";
import { FilterContext } from "@/providers/FilterProvider";
import { usePagination } from "@/providers/PaginationContext";
import { AccessContext } from "@/providers/AccessProvider";
import { getAdminsList, deleteAdmin } from "./InvoicingData";

const statusLabels = {
  active: "Активен",
  inactive: "Приостановлен",
};

const Invoicing = () => {
  const { activePage, setActivePage, totalPages, setTotalPages } =
    usePagination();
  const { adminsList, getAdminsList } = useContext(AccessContext);
  const { openModal, updateDataModal } = useContext(ModalContext);
  const [users, setUsers] = useState([]);
  const [size, setSize] = useState(10);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const { setRefreshTrigger } = useContext(ModalContext);

  useEffect(() => {
    // Устанавливаем в контекст функцию, которую можно будет вызвать из модалки
    setRefreshTrigger(() => () => setRefreshCounter((prev) => prev + 1));
  }, []);

  const fetchUsers = async ({ pageIndex, pageSize, sorting }) => {
    const sortingParams = sorting[0] || { id: null, desc: false };
    const params = {
      page: pageIndex + 1,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
    };
    console.log(sortingParams, "sorting");

    const usersData = await getAdminsList({ params });
    console.log("Это юзер дата", usersData);

    setTotalPages(usersData.total_pages);
    setSize(usersData.per_page);
    setUsers(usersData.items);

    return {
      data: usersData.items,
      totalCount: usersData.total_items,
    };
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdmin(id);
      setRefreshCounter((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length !== 11) return phone;

    return `${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9)}`;
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Статус",
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center gap-2 min-w-[330px]">
              <span className="w-[6px] h-[6px] rounded-full bg-[#04B440]" />
              <div> {statusLabels[info.row.original.status]}</div>
            </div>
          );
        },
        meta: {
          className: "min-w-[100px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.first_name,
        id: "first_name",
        header: () => "ФИО",
        cell: (info) => {
          const handleClick = () => {
            // openModal(info.row.original.id);
            // updateDataModal(info.row.original.id);
          };
          return (
            <div className="text-gray-800 font-normal min-w-[330px]">
              {info.row.original.first_name}
            </div>
          );
        },
        meta: {
          className: "",
        },
      },
      {
        accessorFn: (row) => row.phone_number,
        id: "phone_number",
        header: () => "Телефон",
        cell: (info) => {
          const rawPhone = info.row.original.phone_number;
          const formatted = formatPhoneNumber(rawPhone);
          return (
            <div className="flex items-center justify-start gap-2 min-w-[136px] max-w-[196px]">
              <span className="text-md ki-filled ki-phone text-[#99A1B7]" />
              {/* <KeenIcon icon={"phone"} /> */}
              {formatted}
            </div>
          );
        },
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => {
          return (
            <div className="flex items-center justify-start gap-2">
              <span className="text-md ki-filled ki-sms text-[#99A1B7]" />
              {/* <KeenIcon icon={"sms"} /> */}
              <div className="text-primary">{info.row.original.email}</div>
            </div>
          );
        },
        meta: {
          className: "w-[170px]",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.roles,
        id: "roles",
        header: () => "Роль",
        cell: (info) => {
          return (
            <div className="flex items-center justify-start gap-2 min-w-[330px]">
              {/* <KeenIcon icon={"phone"} /> */}
              {info.row.original.roles.map((role) => role.name + " ")}
            </div>
          );
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
          const handleClick = () => {
            openModal("adminDetails", info.row.original.id, "admins");
            console.log("settings", info.row.original);
          };
          return (
            <div
              className="flex justify-center gap-4"
              // onClick={handleClick}
            >
              <button
                className="ki-filled text-2xl text-danger"
                onClick={() => handleDelete(info.row.original.id)}
              >
                <KeenIcon icon={"trash"} />
              </button>
              <button
                className="ki-filled text-2xl text-primary"
                onClick={handleClick}
              >
                <KeenIcon icon={"setting-2"} />
              </button>

              {info.row.original.settings}
            </div>
          );
        },
        meta: {
          className: "cursor-pointer",
          cellClassName: "text-gray-800 font-normal",
        },
      },
    ],
    [users]
  );
  console.log("users", users);

  const data = useMemo(() => users, [users]);

  return (
    <>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Список пользователей</h3>
        </div>

        <div className="card-body">
          <DataGrid
            key={`${refreshCounter}`}
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
            onFetchData={fetchUsers}
          />
        </div>
      </div>
    </>
  );
};
export { Invoicing };
