import React, { createContext, useState, useMemo } from "react";
import axios from "axios";
import { usePagination } from "@/providers/PaginationContext";
import { BASE_URL } from "../static";

export const TasksFilterContext = createContext();

export const TasksFilterProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [filters, setFilters] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const [newListTasks, setNewListTasks] = useState([]);

  const addFilter = (key, option) => {
    setFilters((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  const updateTasksList = async (finalFilters = filters, page, per_page) => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { page, per_page, ...finalFilters },
      });

      setNewListTasks(response.data);
      setTotalPages(response.data.total_pages);
      setUpdating(false);
    } catch (error) {
      console.error("Ошибка при загрузке всех задач:", error);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setNewListTasks([]);
  };

  const removeFilter = (key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const filterOptions = useMemo(() => filters, [filters]);

  const contextValue = useMemo(
    () => ({
      filterOptions,
      newListTasks,
      addFilter,
      updateTasksList,
      clearFilters,
      setUpdating,
      removeFilter,
    }),
    [filterOptions, newListTasks]
  );

  return (
    <TasksFilterContext.Provider value={contextValue}>
      {children}
    </TasksFilterContext.Provider>
  );
};
