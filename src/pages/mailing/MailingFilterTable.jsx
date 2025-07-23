import React, { useContext, useEffect, useState } from "react";
import { KeenIcon } from "../../components/keenicons";
import { Input } from "../../components/input/input";
import { MailingFilterContext } from "../../providers/MailingFilterProvider";
import { DatePicker, Select } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "../dashboard/dayjsConfig";
import { usePagination } from "../../providers";
import { FlexibleDateTimePicker } from "../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../dashboard/blocks/CustomRangePicker";

export const MailingFilterTable = () => {
  const {
    updateMailingList,
    filterOptions,
    addFilter,
    removeFilter,
    clearFilters,
  } = useContext(MailingFilterContext);
  const { activePage, setActivePage } = usePagination;

  const [searchKey, setSearchKey] = useState("");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState(null); // [start, end]

  const searchOptions = [
    { label: "Не указано", value: "" },
    { label: "ID", value: "campaign_id" },
    { label: "Название", value: "name" },
  ];

  useEffect(() => {
    clearFilters();
  }, []);

  const handleFilterOption = () => {
    // Удаляем все возможные ключи
    removeFilter("campaign_id");
    removeFilter("name");
    removeFilter("start_date");
    removeFilter("end_date");

    // Устанавливаем новые фильтры
    if (searchKey && search) {
      addFilter(searchKey, search);
    }

    if (range && range.length === 2) {
      addFilter("start_date", range[0]);
      addFilter("end_date", range[1]);
    }

    updateMailingList(filterOptions);
    setActivePage(0);
  };

  const [tempDateRange, setTempDateRange] = useState();
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("00:00");
  const [isOpen, setIsOpen] = useState(false);

  const handleDateRangeApply = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      const [fh, fm] = fromTime.split(":").map(Number);
      const [th, tm] = toTime.split(":").map(Number);

      const from = dayjs(tempDateRange.from).hour(fh).minute(fm);
      const to = dayjs(tempDateRange.to).hour(th).minute(tm);

      const formattedStart = from.format("YYYY-MM-DD HH:mm:ss");
      const formattedEnd = to.format("YYYY-MM-DD HH:mm:ss");

      setRange([formattedStart, formattedEnd]);
      setIsOpen(false);
    }
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
    setFromTime("00:00");
    setToTime("00:00");
    setRange(null); // ⬅️ вот это важно
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="input w-full lg:w-1/2">
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
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-1/2">
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
            <div className="w-full">
              <div className="hidden lg:flex">
                {/* <RangePicker
                 format="DD.MM.YYYY"
                 showTime={{ format: "HH:mm" }}
                 onChange={(value) => {
                   if (value && value.length === 2) {
                     const [start, end] = value;
                     const formattedStart =
                       dayjs(start).format("YYYY-MM-DD");
                     const formattedEnd = dayjs(end).format("YYYY-MM-DD");
                     setRange([formattedStart, formattedEnd]);
                   } else {
                     setRange(null);
                   }
                 }}
                 placeholder="Выберите период"
                 className="input"
               /> */}
                <CustomDateRangePicker
                  date={{
                    from: range?.[0] ? dayjs(range[0]).toDate() : null,
                    to: range?.[1] ? dayjs(range[1]).toDate() : null,
                  }}
                  setDate={(rangeObj) => {
                    if (rangeObj?.from && rangeObj?.to) {
                      const formattedStart = dayjs(rangeObj.from)
                        .hour(fromTime.split(":")[0])
                        .minute(fromTime.split(":")[1])
                        .format("YYYY-MM-DD HH:mm:ss");

                      const formattedEnd = dayjs(rangeObj.to)
                        .hour(toTime.split(":")[0])
                        .minute(toTime.split(":")[1])
                        .format("YYYY-MM-DD HH:mm:ss");

                      setRange([formattedStart, formattedEnd]);
                    }
                  }}
                  tempDateRange={tempDateRange}
                  setTempDateRange={setTempDateRange}
                  fromTime={fromTime}
                  setFromTime={setFromTime}
                  toTime={toTime}
                  setToTime={setToTime}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  defaultStartDate={
                    range?.[0] ? dayjs(range[0]).toDate() : new Date()
                  }
                  handleDateRangeApply={handleDateRangeApply}
                  handleDateRangeReset={handleDateRangeReset}
                  labelText="По периоду"
                />
              </div>
              <div className="relative block lg:hidden">
                <label
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                >
                  Искать по периоду
                </label>
                <div className="">
                  <FlexibleDateTimePicker
                    mode="range"
                    withTime={true}
                    value={range}
                    onChange={(value) => {
                      if (value && value.length === 2) {
                        const [start, end] = value;
                        const formattedStart = start.format(
                          "YYYY-MM-DD HH:mm:ss"
                        );
                        const formattedEnd = end.format("YYYY-MM-DD HH:mm:ss");
                        setRange([formattedStart, formattedEnd]);
                      } else {
                        setRange(null);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-xl opacity-90">
                <KeenIcon icon="question-2" />
              </div>
              <button
                className="btn btn-outline btn-primary w-full flex justify-center"
                onClick={handleFilterOption}
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
