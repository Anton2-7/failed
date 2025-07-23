import { useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@/components";
import { usePagination } from "@/providers/PaginationContext";
import { getGiveawayData } from "./GiveawaysData";
import useGiveawayColumns from "../../hooks/useGiveawayColumns";

export function GiveawaysContent() {
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [size, setSize] = useState(10);
  const { columns } = useGiveawayColumns();

  const fetchGiveawayPage = async ({ pageIndex, pageSize, sorting }) => {
    const pageToFetch = pageIndex + 1;
    const sortingParams = sorting[0] || { id: null, desc: false };
    const giveawayData = await getGiveawayData({
      page: pageToFetch,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
    });

    let items = giveawayData.items;

    setTotalPages(giveawayData.total_pages);
    setSize(giveawayData.per_page);

    return {
      data: items,
      totalCount: giveawayData.total_items,
    };
  };

  return (
    <div className="px-6">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Конкурсы
        </h1>
        <Link
          to="/giveaways/settings-giveaway"
          className="btn-sm lg:btn-lg btn btn-primary"
        >
          Добавить конкурс
        </Link>
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Конкурсы</h3>
        </div>
        <div className="card-body">
          <DataGrid
            columns={columns}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            onFetchData={fetchGiveawayPage}
          />
        </div>
      </div>
    </div>
  );
}
