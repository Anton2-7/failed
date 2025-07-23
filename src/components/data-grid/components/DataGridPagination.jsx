import React, { Fragment, useEffect } from "react";
import { KeenIcon } from "@/components";
import { useDataGrid } from "..";
import { usePagination } from "@/providers/PaginationContext";

const DataGridPagination = () => {
  const { table, totalRows, props } = useDataGrid();
  const { activePage, setActivePage, totalPages, totalItems } = usePagination();

  // Синхронизация состояний
  useEffect(() => {
    if (table && activePage !== undefined) {
      table.setPageIndex(activePage);
    }
  }, [activePage, table]);

  // Текущие значения пагинации
  const pageIndex = activePage || 0;
  const pageSize = table?.getState().pagination.pageSize || 10;
  const totalCount = totalItems || totalRows || 0;

  // Расчет отображаемых элементов
  const from = Math.min(pageIndex * pageSize + 1, totalCount);
  const to = Math.min((pageIndex + 1) * pageSize, totalCount);

  // Форматирование информации о пагинации
  const paginationInfo = props.pagination?.info
    ? props.pagination.info
        .replace("{from}", from)
        .replace("{to}", to)
        .replace("{count}", totalCount)
    : `${from}-${to} из ${totalCount}`;

  // Настройки группировки страниц
  const paginationMoreLimit = props.pagination?.moreLimit || 5;
  const currentGroupStart =
    Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(
    currentGroupStart + paginationMoreLimit,
    totalPages
  );

  // Обработчик смены страницы
  const handlePageChange = (newPageIndex) => {
    if (newPageIndex >= 0 && newPageIndex < totalPages) {
      setActivePage(newPageIndex);
    }
  };

  // Рендер кнопок страниц
  const renderPageButtons = () => {
    return Array.from(
      { length: currentGroupEnd - currentGroupStart },
      (_, i) => {
        const pageNumber = currentGroupStart + i;
        return (
          <button
            key={pageNumber}
            className={`btn ${pageIndex === pageNumber ? "active" : ""}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber + 1}
          </button>
        );
      }
    );
  };

  // Рендер кнопок навигации
  const renderNavigationButton = (direction) => {
    const isPrevious = direction === "prev";
    const newPage = isPrevious ? pageIndex - 1 : pageIndex + 1;
    const disabled = isPrevious ? pageIndex <= 0 : pageIndex >= totalPages - 1;
    const icon = isPrevious ? "black-left" : "black-right";

    return (
      <button
        className="btn"
        onClick={() => handlePageChange(newPage)}
        disabled={disabled}
      >
        <KeenIcon icon={icon} className="rtl:transform rtl:rotate-180" />
      </button>
    );
  };

  // Рендер многоточия
  const renderEllipsis = (direction) => {
    if (direction === "prev" && currentGroupStart > 0) {
      return (
        <button
          className="btn"
          onClick={() => handlePageChange(currentGroupStart - 1)}
        >
          ...
        </button>
      );
    }

    if (direction === "next" && currentGroupEnd < totalPages) {
      return (
        <button
          className="btn"
          onClick={() => handlePageChange(currentGroupEnd)}
        >
          ...
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* <span>{paginationInfo}</span> */}
      <div className="pagination">
        {renderNavigationButton("prev")}
        {renderEllipsis("prev")}
        {renderPageButtons()}
        {renderEllipsis("next")}
        {renderNavigationButton("next")}
      </div>
    </div>
  );
};

export { DataGridPagination };
