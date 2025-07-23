import { useMemo, useState } from "react";
import { DataGrid, KeenIcon } from "@/components";
import { getFaqData, swapFaqPosition, deleteFaq } from "./FaqData";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { usePagination } from "@/providers/PaginationContext";

const statusLabels = {
  active: "Активен",
  inactive: "Приостановлен",
};

export const FaqContent = () => {
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchFaqPage = async ({ pageIndex, pageSize }) => {
    const pageToFetch = pageIndex + 1;

    const faqData = await getFaqData({
      page: pageToFetch,
      per_page: pageSize,
    });

    setTotalPages(faqData.total_pages);
    setSize(faqData.per_page);

    return {
      data: faqData.items,
      totalCount: faqData.total_items,
    };
  };

  const handleSwap = async (index, direction, faqData) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqData.length) return;

    const firstId = faqData[index].id;
    const secondId = faqData[targetIndex].id;

    try {
      await swapFaqPosition(firstId, secondId);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("Не удалось поменять позиции", e);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await deleteFaq(faqId);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить вопрос", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.question,
        id: "question",
        header: () => "Вопрос",
        cell: (info) => {
          return (
            <div className="min-w-[300px]">
              <div>{info.row.original.question}</div>
            </div>
          );
        },
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.answer,
        id: "answer",
        header: () => "Ответ",
        cell: (info) => {
          return (
            <div className="min-w-[300px]">
              <ReactMarkdown>{info.row.original.answer}</ReactMarkdown>
            </div>
          );
        },
        meta: {
          className: "",
        },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Статус",
        cell: (info) => {
          return (
            <div className="min-w-[300px]">
              {statusLabels[info.row.original.status]}
            </div>
          );
        },
        meta: {
          className: "",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.position,
        id: "position",
        header: () => "Порядок",
        cell: (info) => {
          return (
            <div className="flex gap-6 justify-center">
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
        accessorFn: (row) => row.settings,
        id: "settings",
        header: () => "Настройки",
        cell: (info) => {
          console.log(info.row);

          return (
            <div className="flex gap-6 justify-center">
              <button
                className="ki-filled text-2xl text-danger"
                onClick={() => handleDelete(info.row.original.id)}
              >
                <KeenIcon icon={"trash"} />
              </button>
              <Link
                to={`/faq/create-update-question/${info.row.original.id}`}
                state={{ faqItem: info.row.original }}
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
    []
  );

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          FAQ
        </h1>
        <Link
          className="btn-sm lg:btn-lg btn btn-primary"
          to="/faq/create-update-question"
        >
          Добавить вопрос
        </Link>
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Вопросы</h3>
        </div>
        <div className="card-body">
          <DataGrid
            key={`datagrid-${refreshKey}`}
            columns={columns}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            onFetchData={fetchFaqPage}
            sorting={[{ id: "position", desc: false }]}
          />
        </div>
      </div>
    </div>
  );
};
