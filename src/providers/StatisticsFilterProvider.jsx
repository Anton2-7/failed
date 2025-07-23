import React, { createContext, useState } from "react";
import axios from "axios";
import { usePagination } from "@/providers/PaginationContext";
import { BASE_URL } from "../static";

export const StatisticsFilterContext = createContext();

export const StatisticsFilterProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [filterOptions, setFilterOptions] = useState({});
  const [isUpdating, setUpdating] = useState(false);
  const [newListStatistics, setNewListStatistics] = useState([]);

  const addFilter = (key, option) => {
    setFilterOptions((prevOptions) => {
      const newOptions = { ...prevOptions, [key]: option };
      return newOptions;
    });
  };

  // Обновление списка пользователей
  const updateStatisticList = async (newfilters, page) => {
    const searchParamBackup = JSON.parse(JSON.stringify(newfilters));
    let obj = {};

    // Сохраняем searchParam, если он существует
    if (
      newfilters.searchParamType &&
      newfilters.searchParamInput !== undefined
    ) {
      obj[newfilters.searchParamType] = newfilters.searchParamInput;
    }
    if (newfilters.searchParamType !== undefined) {
      delete newfilters.searchParamType;
    }
    if (newfilters.searchParamInput !== undefined) {
      delete newfilters.searchParamInput;
    }

    try {
      const params = {
        page: page,
        ...newfilters, // Дополнительные параметры
        ...obj, // Параметр поиска (если есть)
      };
      const response = await axios.get(`${BASE_URL}/statistics/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: params,
      });
      console.log("updateStatisticList", response.data);
      setNewListStatistics(response.data);
      setUpdating(false);
      console.log("response.data.total_pages!!!!!!", response.data.total_pages);

      setTotalPages(response.data.total_pages);
      setFilterOptions((prevOptions) => ({
        ...prevOptions,
        ...searchParamBackup,
      }));

      console.log(filterOptions, "filterOptions updateStatisticList");
    } catch (error) {
      console.error("Error fetching giveaways:", error);
    }
  };

  // Очистка всех фильтров
  const clearFilters = () => {
    setFilterOptions({});
    setNewListStatistics([]); // Очищаем список пользователей
  };

  const removeFilter = (key) => {
    setFilterOptions((prevOptions) => {
      const newOptions = { ...prevOptions };
      delete newOptions[key];
      return newOptions;
    });
  };

  return (
    <StatisticsFilterContext.Provider
      value={{
        filterOptions,
        newListStatistics,
        addFilter,
        removeFilter,
        updateStatisticList,
        clearFilters,
        setUpdating,
      }}
    >
      {children}
    </StatisticsFilterContext.Provider>
  );
};
