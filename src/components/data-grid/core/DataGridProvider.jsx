/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useContext, useEffect, useState } from "react";
import { DataGridInner } from "./DataGridInner";
import { deepMerge } from "@/utils";
const DataGridContext = createContext(undefined);
export const useDataGrid = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider");
  }
  return context;
};
export const DataGridProvider = ({ children, ...props }) => {
  const defaultValues = {
    messages: {
      empty: "Нет доступных данных",
      loading: "Загрузка...",
    },
    pagination: {
      info: "{from} - {to} из {count}",
      sizes: [5, 10, 12, 15, 25],
      sizesLabel: "Show",
      sizesDescription: "per page",
      size: 5,
      page: 0,
      moreLimit: 5,
      more: false,
    },
    layout: {
      cellsBorder: true,
    },
    rowSelect: false,
    serverSide: false,
    groupedHeaders: false,
  };
  const mergedProps = deepMerge(defaultValues, props);
  const [data, setData] = useState(mergedProps.data ?? []);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(mergedProps.data?.length ?? 0);

  // State management for selected rows
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllIndeterminate, setIsSelectAllIndeterminate] =
    useState(false);

  // Pagination and Sorting from props
  const [pagination, setPagination] = useState({
    pageIndex: props.pagination?.page ?? 0,
    pageSize: props.pagination?.size ?? 5,
  });
  const [sorting, setSorting] = useState(mergedProps.sorting ?? []);
  const [filters, setFilters] = useState(mergedProps.filters ?? []);

  // Fetch data for server-side pagination, sorting, and filtering
  const fetchServerSideData = async () => {
    if (!mergedProps.onFetchData) return;
    setLoading(true);
    try {
      const requestParams = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        filters,
      };

      const { data, totalCount } = await mergedProps.onFetchData(requestParams);
      if (data && totalCount) {
        setData(data);
        setTotalRows(totalCount);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };
  const table = useReactTable({
    columns: mergedProps.columns,
    // Access columns from mergedProps
    data: data,
    // Access data from mergedProps
    debugTable: false,
    pageCount: mergedProps.serverSide
      ? Math.ceil(totalRows / pagination.pageSize)
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: mergedProps.serverSide,
    manualSorting: mergedProps.serverSide,
    enableSortingRemoval: false,
    manualFiltering: mergedProps.serverSide,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    state: {
      pagination,
      sorting,
      columnFilters: filters,
    },
  });
  const toggleRowSelection = (id) => {
    setSelectedRowIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      if (props.onRowsSelectChange) {
        props.onRowsSelectChange(newSelected);
      }
      return newSelected;
    });
  };
  const toggleAllRowsSelection = (checked) => {
    const allRowIds = table.getRowModel().rows.map((row) => row.id);
    const newSelectedRowIds = checked ? new Set(allRowIds) : new Set();
    setSelectedRowIds(newSelectedRowIds);
    if (props.onRowsSelectChange) {
      props.onRowsSelectChange(newSelectedRowIds);
    }
  };
  const getSelectedRowIds = () => {
    return Array.from(selectedRowIds);
  };

  // Handle sorting, pagination, and search loading
  const handleStateChange = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after action completes
    }, 300); // Delay for smooth experience
    return () => clearTimeout(timer);
  };
  useEffect(() => {
    if (mergedProps.serverSide) {
      fetchServerSideData();
    }
  }, [pagination, sorting, filters]);

  // Listen for sorting changes
  useEffect(() => {
    if (table.getState().sorting.length > 0) {
      handleStateChange();
    }
  }, [table.getState().sorting]);

  // Listen for pagination changes
  useEffect(() => {
    handleStateChange();
  }, [table.getState().pagination]);

  // Handle data loading (trigger loading when data is being fetched)
  useEffect(() => {
    if (data.length === 0) {
      setLoading(true);
    } else {
      setLoading(false); // Data loaded
    }
  }, [data]);
  useEffect(() => {
    const allRowIds = table.getRowModel().rows.map((row) => row.id);
    const isAllSelected = allRowIds.every((id) => selectedRowIds.has(id));
    const isSomeSelected = allRowIds.some((id) => selectedRowIds.has(id));
    setIsSelectAllChecked(isAllSelected);
    setIsSelectAllIndeterminate(!isAllSelected && isSomeSelected);
  }, [selectedRowIds, table.getRowModel().rows]);

  return (
    <DataGridContext.Provider
      value={{
        props: mergedProps,
        table,
        totalRows,
        loading,
        setLoading,
        selectedRowIds,
        toggleRowSelection,
        toggleAllRowsSelection,
        getSelectedRowIds,
        isSelectAllChecked,
        isSelectAllIndeterminate,
      }}
    >
      {/* <DataGridInner /> */}
      {children}
    </DataGridContext.Provider>
  );
};
