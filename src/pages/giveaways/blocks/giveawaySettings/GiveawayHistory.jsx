import { useState, useMemo, useEffect } from "react";
import { getGiveawayHistoryData } from "./GiveawayHistoryData";
import useGiveawayHistoryColumns from "../../hooks/useGiveawayHistoryColumns";
import { DataGrid, KeenIcon } from "../../../../components";
import { TableSettingsMenu } from "../settingsTable/TableSettingsMenu";
import { usePagination } from "@/providers/PaginationContext";
import { useParams } from "react-router";

export default function GiveawayHistory() {
  const { id } = useParams();
  const giveawayId = id;
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [hideWinners, setHideWinners] = useState(false);

  const [size, setSize] = useState(10);
  const { columns } = useGiveawayHistoryColumns({ hideWinners });
  const [isVisibleTable, setIsVisibleTable] = useState(true);

  const [visibleColumns, setVisibleColumns] = useState({
    end_date: true,
    number: true,
    status: true,
    participants_count: true,
    price: true,
    spent_tickets: true,
    winners: true,
  });

  const [tempVisibleColumns, setTempVisibleColumns] = useState({
    ...visibleColumns,
  });

  const fetchGiveawayHistoryPage = async ({ pageIndex, pageSize, sorting }) => {
    const pageToFetch = pageIndex + 1;
    const sortingParams = sorting[0] || { id: null, desc: false };
    const giveawayHistoryData = await getGiveawayHistoryData({
      page: pageToFetch,
      per_page: pageSize,
      order_by: sortingParams.id || null,
      order_direction: sortingParams.desc ? "desc" : "asc",
      giveaway_id: giveawayId,
    });
    console.log(giveawayHistoryData);

    setTotalPages(giveawayHistoryData.total_pages);
    setSize(giveawayHistoryData.per_page);

    if (id) {
      return {
        data: giveawayHistoryData.items,
        totalCount: giveawayHistoryData.total_items,
      };
    } else {
      return {};
    }
  };

  const handleColumnToggle = (columnId) => {
    setTempVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleSaveSettings = () => {
    setVisibleColumns({ ...tempVisibleColumns });
  };

  const handleSelectAll = (select) => {
    const newColumns = Object.keys(tempVisibleColumns).reduce((acc, key) => {
      acc[key] = select;
      return acc;
    }, {});
    setTempVisibleColumns(newColumns);
  };

  const isAllSelected = useMemo(() => {
    return Object.values(tempVisibleColumns).every((val) => val);
  }, [tempVisibleColumns]);

  const filteredColumns = useMemo(() => {
    return columns.filter((column) => visibleColumns[column.id]);
  }, [columns, visibleColumns]);

  return (
    <div className="card card-grid h-full min-w-full">
      <div className="card-header flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="card-title">История проведения</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHideWinners(false)}
            className={`ki-filled text-xl text-gray-400 hover:text-gray-600 transition-colors ${
              !hideWinners ? "hidden" : "block"
            }`}
          >
            <KeenIcon icon={"eye"} />
          </button>
          <button
            onClick={() => setHideWinners(true)}
            className={`ki-filled text-xl text-gray-400 hover:text-gray-600 transition-colors ${
              hideWinners ? "hidden" : "block"
            }`}
          >
            <KeenIcon icon={"eye-slash"} />
          </button>

          <TableSettingsMenu
            columns={columns}
            tempVisibleColumns={tempVisibleColumns}
            onToggleColumn={handleColumnToggle}
            isAllSelected={isAllSelected}
            onToggleAll={() => handleSelectAll(!isAllSelected)}
            onSave={handleSaveSettings}
            isVisibleTable={isVisibleTable}
          />
        </div>
      </div>

      <div className="card-body">
        {isVisibleTable && (
          <DataGrid
            key={`id=${id}`}
            columns={filteredColumns}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            onFetchData={fetchGiveawayHistoryPage}
            rowSelect={true}
          />
        )}
      </div>
    </div>
  );
}
