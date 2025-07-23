import React, { useContext, useEffect, useState } from "react";
import { KeenIcon } from "../../components/keenicons";
import { Selector } from "../../components/selector/selectot";
import { Select } from "antd";
import { Input } from "../../components/input/input";
import { TasksFilterContext } from "../../providers/TasksFilterProvider";
import { usePagination } from "../../providers";

export const TasksFilterTable = () => {
  const {
    updateTasksList,
    filterOptions,
    addFilter,
    removeFilter,
    clearFilters,
  } = useContext(TasksFilterContext);
  // const [localFilters, setLocalFilters] = useState({});
  const { activePage, setActivePage } = usePagination;

  const [searchKey, setSearchKey] = useState("");
  const [search, setSearch] = useState("");

  const searchOptions = [
    { label: "Не указано", value: "" },
    { label: "ID", value: "task_id" },
    { label: "Название", value: "name" },
  ];

  useEffect(() => {
    clearFilters();
  }, []);

  const handleFilterOption = () => {
    // Удаляем все возможные ключи
    removeFilter("task_id");
    removeFilter("name");

    // Устанавливаем новые фильтры
    if (searchKey && search) {
      addFilter(searchKey, search);
    }

    updateTasksList(filterOptions);
    // setActivePage(0);
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="input w-full lg:w-2/3">
            <i className="ki-outline ki-magnifier"></i>
            <input
              placeholder="Поиск"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilterOption();
                }
              }}
            />
          </div>
          <div className="flex gap-4 w-full lg:w-1/3">
            <div className="w-full relative">
              <label
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                  display: "inline",
                  marginBottom: "0px",
                }}
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              >
                Искать по параметрам
              </label>

              <Select
                className="input ps-0 pe-0 border-none"
                placeholder="Искать по параметрам"
                options={searchOptions}
                value={searchKey}
                onChange={(value) => setSearchKey(value)}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-xl opacity-90">
                <KeenIcon icon="question-2" />
              </div>
              <button
                className="btn btn-outline btn-primary"
                onClick={(e) => {
                  handleFilterOption();
                  e.target.blur();
                }}
              >
                Искать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
