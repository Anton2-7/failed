import React, { useEffect, useState } from "react";
import { CircularGraph } from "./CircularGraph/CircularGraph";
import axios from "axios"; // замени на реальный
import { BASE_URL } from "../../../static";
import VariableThicknessDonut from "./CircularGraph/VariableThicknessDonut";
import DonutFromAPI from "./CircularGraph/DonutFromAPI";
import ChartCard from "./ChartCards/ChartCard";
import TicketChartCard from "./ChartCards/TicketChartCard";
import ReferalChartCard from "./ChartCards/ReferalChartCard";
import PayRouletChartCard from "./ChartCards/PayRouletChartCard";
import { InfoHub } from "./InfoHub";
import { DashboardRegistr } from "./DashboardRegistr";
import { DashboardTasks } from "./DashboardTasks";
import { DashboardTicket } from "./DashboardTicket";
import { DashboardUsers } from "./DashboardUsers";
import { Select, DatePicker, Modal } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;
import dayjs from "../dayjsConfig";
import { MetricsSettingsPopover } from "./MetricsSettingsPopover";

import { DateRange } from "react-date-range";
import { addHours } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useMediaQuery } from "react-responsive";
// import { MobileDateTimeRangePicker } from "./MobileDateTimeRangePicker";
import { FlexibleDateTimePicker } from "../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
// import FlatpickrRangePicker from "../../../components/CustomDatePicker/CustomDatePicker";
// import CustomRangePicker from "./CustomRangePicker";
// import CustomRangeCalendar from "./CustomRangeCalendar";
// import CalendarField from "./CalendarField";

import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Calendar, TimePicker } from "./Calendar";
import { CalendarDays } from "lucide-react";
import { addDays, format } from "date-fns";
import { Button } from "./button";
import { ru } from "date-fns/locale";
import { CustomDateRangePicker } from "./CustomRangePicker";

export const DashboardContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const from = dayjs().subtract(7, "day");
    const to = dayjs();
    return [from, to];
  });
  const [date, setDate] = useState({
    from: new Date(2025, 0, 20),
    to: addDays(new Date(2025, 0, 20), 20),
  });
  const [tempDateRange, setTempDateRange] = useState(() =>
    dateRange?.[0] && dateRange?.[1]
      ? {
          from: dateRange[0].toDate(),
          to: dateRange[1].toDate(),
        }
      : undefined
  );

  const handleDateRangeApply = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      const [fh, fm] = fromTime.split(":").map(Number);
      const [th, tm] = toTime.split(":").map(Number);

      const from = dayjs(tempDateRange.from).hour(fh).minute(fm);
      const to = dayjs(tempDateRange.to).hour(th).minute(tm);

      setDateRange([from, to]);
      applyGlobalDateRangeToAll([from, to]);
      setIsOpen(false);

      // логика сохранения или передачи отфильтрованных данных
    }
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
    setFromTime("00:00");
    setToTime("00:00");
    setDateRange([]);
    setIsOpen(false);
  };

  const defaultStartDate = new Date();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tasksData, setTasksData] = useState([]);
  const [giveawaysData, setGiveawaysData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  // const [dateRange, setDateRange] = useState([
  //   dayjs().subtract(7, "day"),
  //   dayjs().startOf("day"),
  // ]);

  const [grouping, setGrouping] = useState("day");

  const [visibleMetrics, setVisibleMetrics] = useState([
    "users",
    "tickets",
    "tasks",
    "giveaways",
    "referrals",
    "wheel",
  ]);

  const chartData = [
    { label: "BetBoom", value: 30, color: "#1E90FF" },
    { label: "YouTube", value: 25, color: "#FFA500" },
    { label: "VK", value: 10, color: "#9932CC" },
    { label: "Email", value: 1, color: "#A7F7F1" },
    { label: "Email", value: 1, color: "#44A6F1" },
    { label: "Email", value: 1, color: "#4218F1" },
    { label: "Email", value: 1, color: "#111111" },
  ];

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const [tasksRes, giveawaysRes] = await Promise.all([
  //           axios.get(
  //             `${BASE_URL}/dashboards/graphs/tasks?start=2025-01-01T00:00&end=2025-05-14T00:00`
  //           ),
  //           axios.get(
  //             `${BASE_URL}/dashboards/graphs/giveaways?start=2025-01-01&end=2025-05-14`
  //           ),
  //         ]);
  //         setTasksData(tasksRes.data);
  //         setGiveawaysData(giveawaysRes.data);
  //         console.log(tasksData, "tasksData");
  //         console.log(giveawaysData, "giveawaysData");
  //       } catch (err) {
  //         console.error("Ошибка загрузки графиков", err);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  const isMobile = useMediaQuery({ maxWidth: 1024 });

  const [openedChartId, setOpenedChartId] = useState(null);

  const openChartModal = (chartId) => setOpenedChartId(chartId);
  const closeChartModal = () => setOpenedChartId(null);
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("00:00");

  const [chartFilters, setChartFilters] = useState({
    users: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
    tickets: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
    tasks: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
    giveaways: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
    refferals: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
    wheel: {
      dateRange: [dayjs().subtract(7, "day"), dayjs()],
      tempDateRange: null,
      fromTime: "00:00",
      toTime: "23:59",
      isOpen: false,
      overriddenByGlobal: false,
    },
  });

  const applyGlobalDateRangeToAll = ([from, to]) => {
    const [fh, fm] = fromTime.split(":").map(Number);
    const [th, tm] = toTime.split(":").map(Number);

    const fromWithTime = dayjs(from).hour(fh).minute(fm);
    const toWithTime = dayjs(to).hour(th).minute(tm);

    const updatedFilters = {};

    Object.keys(chartFilters).forEach((key) => {
      updatedFilters[key] = {
        ...chartFilters[key],
        dateRange: [fromWithTime, toWithTime],
        overriddenByGlobal: true,
      };
    });

    setChartFilters((prev) => ({ ...prev, ...updatedFilters }));
  };

  const updateChartFilter = (chartKey, updates) => {
    setChartFilters((prev) => ({
      ...prev,
      [chartKey]: {
        ...prev[chartKey],
        ...updates,
      },
    }));
  };

  useEffect(() => {
    if (isOpen && !tempDateRange && dateRange?.[0] && dateRange?.[1]) {
      setTempDateRange({
        from: dateRange[0].toDate(),
        to: dateRange[1].toDate(),
      });
    }
  }, [isOpen]);

  return (
    <div className="px-8 mb-8">
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <div>
          <Select
            className="input ps-0 pe-0 border-none min-w-[100px]"
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >
            <Option value={"today"}>Сегодня</Option>
            <Option value={"yesterday"}>Вчера</Option>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* <div className="flex gap-4">
          <div
            style={{ boxShadow: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)" }}
            className="rounded-md border border-[#F1F1F4] bg-[#FFFFFF] w-1/2"
          >
            <CircularGraph data={tasksData} dataType="tasks" />
          </div>
          <div
            style={{ boxShadow: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)" }}
            className="rounded-md border border-[#F1F1F4] bg-[#FFFFFF] w-1/2"
          >
            <CircularGraph data={giveawaysData} dataType="giveaways" />
          </div>
        </div> */}
        {/* <InfoHub /> */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <DashboardUsers period={selectedPeriod} />
            <DashboardRegistr period={selectedPeriod} />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <DashboardTasks period={selectedPeriod} />
            <DashboardTicket period={selectedPeriod} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="relative">
            <label
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                zIndex: 49,
              }}
            >
              Диапазон
            </label>

            {isMobile ? (
              <FlexibleDateTimePicker
                mode="range"
                withTime={true}
                value={dateRange}
                onChange={setDateRange}
              />
            ) : (
              // <RangePicker
              //   placeholder="Выберите дату"
              //   className="h-10"
              //   showTime={{ format: "HH:mm" }}
              //   format="YYYY-MM-DD HH:mm"
              //   value={dateRange}
              //   onCalendarChange={(dates) => {
              //     // Если пользователь выбрал обе даты — сохраняем
              //     if (dates?.[0] && dates?.[1]) {
              //       setDateRange(dates);
              //     }
              //   }}
              //   onOpenChange={(open) => {
              //     if (open) {
              //       // Сброс текущего выбора при открытии календаря
              //       setDateRange([]);
              //     }
              //   }}
              //   allowClear={false}
              // />
              <div className="min-w-[251px]">
                <CustomDateRangePicker
                  date={{
                    from: dateRange?.[0]?.toDate?.(),
                    to: dateRange?.[1]?.toDate?.(),
                  }}
                  tempDateRange={tempDateRange}
                  setTempDateRange={setTempDateRange}
                  fromTime={fromTime}
                  setFromTime={setFromTime}
                  toTime={toTime}
                  setToTime={setToTime}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  defaultStartDate={dateRange?.[0]?.toDate?.() || new Date()}
                  handleDateRangeApply={handleDateRangeApply}
                  handleDateRangeReset={handleDateRangeReset}
                  labelText="Диапазон"
                />
              </div>
            )}
          </div>

          {/* <div style={{ width: 300 }}>
            <FlatpickrRangePicker value={dateRange} onChange={setDateRange} />
          </div> */}

          {/* <CustomRangePicker
            value={dateRange}
            onChange={(range) => setDateRange(range)}
          /> */}

          {/* <CalendarField /> */}

          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex gap-2">
              <button
                className={`w-1/2 lg:w-auto btn border border-[#DBDFE9] border rounded-md bg-white`}
                onClick={() => setGrouping("day")}
              >
                По дням
              </button>
              <button
                className={`w-1/2 lg:w-auto btn border border-[#DBDFE9] border rounded-md bg-white`}
                onClick={() => setGrouping("week")}
              >
                По неделям
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className={`w-1/2 lg:w-auto btn border border-[#DBDFE9] border rounded-md bg-white`}
                onClick={() => setGrouping("month")}
              >
                По месяцам
              </button>
              <MetricsSettingsPopover
                metrics={[
                  { id: "users", label: "Пользователи" },
                  { id: "tickets", label: "Билеты" },
                  { id: "tasks", label: "Задания" },
                  { id: "giveaways", label: "Участия в конкурсах" },
                  { id: "referrals", label: "Приглашено рефералов" },
                  { id: "wheel", label: "Покупок рулетки" },
                ]}
                visibleMetrics={visibleMetrics}
                onSave={(updated) => setVisibleMetrics(updated)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-8">
          {visibleMetrics.includes("users") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <ChartCard
                dateRange={chartFilters.users.dateRange}
                setDateRange={(range) =>
                  updateChartFilter("users", { dateRange: range })
                }
                tempDateRange={chartFilters.users.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("users", { tempDateRange: val })
                }
                fromTime={chartFilters.users.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("users", { fromTime: val })
                }
                toTime={chartFilters.users.toTime}
                setToTime={(val) => updateChartFilter("users", { toTime: val })}
                isOpen={chartFilters.users.isOpen}
                setIsOpen={(val) => updateChartFilter("users", { isOpen: val })}
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.users;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("users", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("users", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                grouping={grouping}
                onOpenFullSize={() => openChartModal("users")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "users"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            <ChartCard
              dateRange={chartFilters.users.dateRange}
              setDateRange={(range) =>
                updateChartFilter("users", { dateRange: range })
              }
              tempDateRange={chartFilters.users.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("users", { tempDateRange: val })
              }
              fromTime={chartFilters.users.fromTime}
              setFromTime={(val) =>
                updateChartFilter("users", { fromTime: val })
              }
              toTime={chartFilters.users.toTime}
              setToTime={(val) => updateChartFilter("users", { toTime: val })}
              isOpen={chartFilters.users.isOpen}
              setIsOpen={(val) => updateChartFilter("users", { isOpen: val })}
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } = chartFilters.users;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("users", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("users", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
          {visibleMetrics.includes("tickets") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <TicketChartCard
                dateRange={chartFilters.tickets.dateRange}
                setDateRange={(val) =>
                  updateChartFilter("tickets", { dateRange: val })
                }
                tempDateRange={chartFilters.tickets.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("tickets", { tempDateRange: val })
                }
                fromTime={chartFilters.tickets.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("tickets", { fromTime: val })
                }
                toTime={chartFilters.tickets.toTime}
                setToTime={(val) =>
                  updateChartFilter("tickets", { toTime: val })
                }
                isOpen={chartFilters.tickets.isOpen}
                setIsOpen={(val) =>
                  updateChartFilter("tickets", { isOpen: val })
                }
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.tickets;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("tickets", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("tickets", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                grouping={grouping}
                onOpenFullSize={() => openChartModal("tickets")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "tickets"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            <TicketChartCard
              dateRange={chartFilters.tickets.dateRange}
              setDateRange={(val) =>
                updateChartFilter("tickets", { dateRange: val })
              }
              tempDateRange={chartFilters.tickets.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("tickets", { tempDateRange: val })
              }
              fromTime={chartFilters.tickets.fromTime}
              setFromTime={(val) =>
                updateChartFilter("tickets", { fromTime: val })
              }
              toTime={chartFilters.tickets.toTime}
              setToTime={(val) => updateChartFilter("tickets", { toTime: val })}
              isOpen={chartFilters.tickets.isOpen}
              setIsOpen={(val) => updateChartFilter("tickets", { isOpen: val })}
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } =
                  chartFilters.tickets;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("tickets", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("tickets", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
          {visibleMetrics.includes("tasks") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <VariableThicknessDonut
                dateRange={chartFilters.tasks.dateRange}
                setDateRange={(val) =>
                  updateChartFilter("tasks", { dateRange: val })
                }
                tempDateRange={chartFilters.tasks.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("tasks", { tempDateRange: val })
                }
                fromTime={chartFilters.tasks.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("tasks", { fromTime: val })
                }
                toTime={chartFilters.tasks.toTime}
                setToTime={(val) => updateChartFilter("tasks", { toTime: val })}
                isOpen={chartFilters.tasks.isOpen}
                setIsOpen={(val) => updateChartFilter("tasks", { isOpen: val })}
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.tasks;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("tasks", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("tasks", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                title="Задания"
                fetchUrl="https://adminapp.gamesport.com/admin_panel/dashboards/graphs/tasks"
                grouping={grouping}
                onOpenFullSize={() => openChartModal("tasks")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "tasks"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            <VariableThicknessDonut
              dateRange={chartFilters.tasks.dateRange}
              setDateRange={(val) =>
                updateChartFilter("tasks", { dateRange: val })
              }
              tempDateRange={chartFilters.tasks.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("tasks", { tempDateRange: val })
              }
              fromTime={chartFilters.tasks.fromTime}
              setFromTime={(val) =>
                updateChartFilter("tasks", { fromTime: val })
              }
              toTime={chartFilters.tasks.toTime}
              setToTime={(val) => updateChartFilter("tasks", { toTime: val })}
              isOpen={chartFilters.tasks.isOpen}
              setIsOpen={(val) => updateChartFilter("tasks", { isOpen: val })}
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } = chartFilters.tasks;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("tasks", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("tasks", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              title="Задания"
              fetchUrl="https://adminapp.gamesport.com/admin_panel/dashboards/graphs/tasks"
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
          {visibleMetrics.includes("giveaways") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <VariableThicknessDonut
                dateRange={chartFilters.giveaways.dateRange}
                setDateRange={(val) =>
                  updateChartFilter("giveaways", { dateRange: val })
                }
                tempDateRange={chartFilters.giveaways.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("giveaways", { tempDateRange: val })
                }
                fromTime={chartFilters.giveaways.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("giveaways", { fromTime: val })
                }
                toTime={chartFilters.giveaways.toTime}
                setToTime={(val) =>
                  updateChartFilter("giveaways", { toTime: val })
                }
                isOpen={chartFilters.giveaways.isOpen}
                setIsOpen={(val) =>
                  updateChartFilter("giveaways", { isOpen: val })
                }
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.giveaways;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("giveaways", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("giveaways", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                title="Участия в конкурсах"
                fetchUrl="https://adminapp.gamesport.com/admin_panel/dashboards/graphs/giveaways"
                grouping={grouping}
                onOpenFullSize={() => openChartModal("giveaways")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "giveaways"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            <VariableThicknessDonut
              dateRange={chartFilters.giveaways.dateRange}
              setDateRange={(val) =>
                updateChartFilter("giveaways", { dateRange: val })
              }
              tempDateRange={chartFilters.giveaways.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("giveaways", { tempDateRange: val })
              }
              fromTime={chartFilters.giveaways.fromTime}
              setFromTime={(val) =>
                updateChartFilter("giveaways", { fromTime: val })
              }
              toTime={chartFilters.giveaways.toTime}
              setToTime={(val) =>
                updateChartFilter("giveaways", { toTime: val })
              }
              isOpen={chartFilters.giveaways.isOpen}
              setIsOpen={(val) =>
                updateChartFilter("giveaways", { isOpen: val })
              }
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } =
                  chartFilters.giveaways;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("giveaways", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("giveaways", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              title="Участия в конкурсах"
              fetchUrl="https://adminapp.gamesport.com/admin_panel/dashboards/graphs/giveaways"
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
          {visibleMetrics.includes("referrals") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <ReferalChartCard
                dateRange={chartFilters.refferals.dateRange}
                setDateRange={(val) =>
                  updateChartFilter("refferals", { dateRange: val })
                }
                tempDateRange={chartFilters.refferals.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("refferals", { tempDateRange: val })
                }
                fromTime={chartFilters.refferals.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("refferals", { fromTime: val })
                }
                toTime={chartFilters.refferals.toTime}
                setToTime={(val) =>
                  updateChartFilter("refferals", { toTime: val })
                }
                isOpen={chartFilters.refferals.isOpen}
                setIsOpen={(val) =>
                  updateChartFilter("refferals", { isOpen: val })
                }
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.refferals;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("refferals", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("refferals", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                grouping={grouping}
                onOpenFullSize={() => openChartModal("refferals")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "refferals"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            {" "}
            <ReferalChartCard
              dateRange={chartFilters.refferals.dateRange}
              setDateRange={(val) =>
                updateChartFilter("refferals", { dateRange: val })
              }
              tempDateRange={chartFilters.refferals.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("refferals", { tempDateRange: val })
              }
              fromTime={chartFilters.refferals.fromTime}
              setFromTime={(val) =>
                updateChartFilter("refferals", { fromTime: val })
              }
              toTime={chartFilters.refferals.toTime}
              setToTime={(val) =>
                updateChartFilter("refferals", { toTime: val })
              }
              isOpen={chartFilters.refferals.isOpen}
              setIsOpen={(val) =>
                updateChartFilter("refferals", { isOpen: val })
              }
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } =
                  chartFilters.refferals;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("refferals", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("refferals", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
          {visibleMetrics.includes("wheel") && (
            <div className="w-full lg:w-[calc(50%-1rem)]">
              <PayRouletChartCard
                dateRange={chartFilters.wheel.dateRange}
                setDateRange={(val) =>
                  updateChartFilter("wheel", { dateRange: val })
                }
                tempDateRange={chartFilters.wheel.tempDateRange}
                setTempDateRange={(val) =>
                  updateChartFilter("wheel", { tempDateRange: val })
                }
                fromTime={chartFilters.wheel.fromTime}
                setFromTime={(val) =>
                  updateChartFilter("wheel", { fromTime: val })
                }
                toTime={chartFilters.wheel.toTime}
                setToTime={(val) => updateChartFilter("wheel", { toTime: val })}
                isOpen={chartFilters.wheel.isOpen}
                setIsOpen={(val) => updateChartFilter("wheel", { isOpen: val })}
                handleDateRangeApply={() => {
                  const { tempDateRange, fromTime, toTime } =
                    chartFilters.wheel;
                  if (!tempDateRange?.from || !tempDateRange?.to) return;

                  const from = dayjs(tempDateRange.from)
                    .hour(+fromTime.split(":")[0])
                    .minute(+fromTime.split(":")[1]);
                  const to = dayjs(tempDateRange.to)
                    .hour(+toTime.split(":")[0])
                    .minute(+toTime.split(":")[1]);

                  updateChartFilter("wheel", {
                    dateRange: [from, to],
                    isOpen: false,
                  });
                }}
                handleDateRangeReset={() => {
                  updateChartFilter("wheel", {
                    tempDateRange: null,
                    dateRange: [],
                    isOpen: false,
                  });
                }}
                grouping={grouping}
                onOpenFullSize={() => openChartModal("wheel")}
              />
            </div>
          )}
          <Modal
            open={openedChartId === "wheel"}
            onCancel={closeChartModal}
            footer={null}
            width="70%"
            style={{ top: 158 }}
            bodyStyle={{
              padding: 0, // Убирает внутренний отступ модалки
              overflow: "hidden", // Опционально — если график рисуется снаружи
            }}
            closable={false}
          >
            {" "}
            <PayRouletChartCard
              dateRange={chartFilters.wheel.dateRange}
              setDateRange={(val) =>
                updateChartFilter("wheel", { dateRange: val })
              }
              tempDateRange={chartFilters.wheel.tempDateRange}
              setTempDateRange={(val) =>
                updateChartFilter("wheel", { tempDateRange: val })
              }
              fromTime={chartFilters.wheel.fromTime}
              setFromTime={(val) =>
                updateChartFilter("wheel", { fromTime: val })
              }
              toTime={chartFilters.wheel.toTime}
              setToTime={(val) => updateChartFilter("wheel", { toTime: val })}
              isOpen={chartFilters.wheel.isOpen}
              setIsOpen={(val) => updateChartFilter("wheel", { isOpen: val })}
              handleDateRangeApply={() => {
                const { tempDateRange, fromTime, toTime } = chartFilters.wheel;
                if (!tempDateRange?.from || !tempDateRange?.to) return;

                const from = dayjs(tempDateRange.from)
                  .hour(+fromTime.split(":")[0])
                  .minute(+fromTime.split(":")[1]);
                const to = dayjs(tempDateRange.to)
                  .hour(+toTime.split(":")[0])
                  .minute(+toTime.split(":")[1]);

                updateChartFilter("wheel", {
                  dateRange: [from, to],
                  isOpen: false,
                });
              }}
              handleDateRangeReset={() => {
                updateChartFilter("wheel", {
                  tempDateRange: null,
                  dateRange: [],
                  isOpen: false,
                });
              }}
              grouping={grouping}
              isFullSize={true}
              onCloseFullSize={closeChartModal}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};
