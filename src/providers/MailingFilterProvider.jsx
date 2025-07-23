import React, { createContext, useState, useMemo } from "react";
import axios from "axios";
import { usePagination } from "@/providers/PaginationContext";
import { BASE_URL } from "../static";

export const MailingFilterContext = createContext();

export const MailingFilterProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [filters, setFilters] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const [newListMailing, setNewListMailing] = useState([]);

  const addFilter = (key, option) => {
    setFilters((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  const updateMailingList = async (finalFilters = filters, page, per_page) => {
    try {
      const response = await axios.get(`${BASE_URL}/campaigns/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          per_page,
          ...finalFilters, // тут уже campaign_id будет ключом, если ты правильно собрал в handleFilterOption
        },
      });

      setNewListMailing(response.data);
      setTotalPages(response.data.total_pages);
      setUpdating(false);
    } catch (error) {
      console.error("Ошибка при фильтрации задач:", error);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setNewListMailing([]);
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
      newListMailing,
      addFilter,
      updateMailingList,
      clearFilters,
      setUpdating,
      removeFilter,
    }),
    [filterOptions, newListMailing]
  );

  return (
    <MailingFilterContext.Provider value={contextValue}>
      {children}
    </MailingFilterContext.Provider>
  );
};
