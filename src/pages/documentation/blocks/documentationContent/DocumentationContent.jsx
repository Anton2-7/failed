import { useMemo, useState } from "react";
import { DataGrid, KeenIcon } from "@/components";
import {
  getDocumentationData,
  swapDocumentationPosition,
  deleteDocumentation,
} from "./DocumentationData";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { usePagination } from "@/providers/PaginationContext";

const statusLabels = {
  active: "Активен",
  inactive: "Приостановлен",
};

export const DocumentationContent = () => {
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchDocumentationPage = async ({ pageIndex, pageSize }) => {
    const pageToFetch = pageIndex + 1;

    const documentationData = await getDocumentationData({
      page: pageToFetch,
      per_page: pageSize,
    });

    setTotalPages(documentationData.total_pages);
    setSize(documentationData.per_page);

    return {
      data: documentationData.items,
      totalCount: documentationData.total_items,
    };
  };

  const handleSwap = async (index, direction, documentationData) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= documentationData.length) return;

    const firstId = documentationData[index].id;
    const secondId = documentationData[targetIndex].id;

    try {
      await swapDocumentationPosition(firstId, secondId);
      setRefreshKey((prev) => prev + 1);
    } catch (e) {
      console.error("Не удалось поменять позиции", e);
    }
  };

  const handleDelete = async (documentationId) => {
    try {
      await deleteDocumentation(documentationId);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Не удалось удалить вопрос", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.name,
        id: "name",
        header: () => "Название",
        cell: (info) => {
          return (
            <div className="min-w-[300px]">
              <div>{info.row.original.name}</div>
            </div>
          );
        },
        meta: {
          className: "w-1/3",
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.text,
        id: "text",
        header: () => "Содержание",
        cell: (info) => {
          return (
            <div className="max-h-24 overflow-hidden text-ellipsis line-clamp-2 min-w-[946px]">
              <ReactMarkdown>{info.row.original.text}</ReactMarkdown>
            </div>
          );
        },
        meta: {
          className: "w-1/3",
        },
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Статус",
        cell: (info) => {
          return statusLabels[info.row.original.status];
        },
        meta: {
          className: "w-1/3",
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
                to={`/documentation/create-update-documentation/${info.row.original.id}`}
                state={{ documentationItem: info.row.original }}
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
          Документация
        </h1>
        <Link
          className="btn-sm lg:btn-lg btn btn-primary"
          to="/documentation/create-update-documentation"
        >
          Добавить документ
        </Link>
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Документы</h3>
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
            onFetchData={fetchDocumentationPage}
            sorting={[{ id: "position", desc: false }]}
          />
        </div>
      </div>
    </div>
  );
};
