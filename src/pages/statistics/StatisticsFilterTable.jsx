import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { KeenIcon } from "../../components/keenicons";
import { Selector } from "../../components/selector/selectot";
// import { Input } from "../../components/input/input";
import { StatisticsFilterContext } from "../../providers/StatisticsFilterProvider";
import axios from "axios";
import { BASE_URL } from "../../static";
import { DatePicker, Select, InputNumber, Input } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
import dayjs from "../dashboard/dayjsConfig";
import { ChevronUp, ChevronDown } from "lucide-react";
import { FlexibleDateTimePicker } from "../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../dashboard/blocks/CustomRangePicker";

export const StatisticsFilterTable = () => {
  const {
    filterOptions,
    addFilter,
    removeFilter,
    updateStatisticList,
    clearFilters,
  } = useContext(StatisticsFilterContext);

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [filter, setFilter] = useState({});
  const [search, setSearch] = useState("");
  const [giveawaysData, setGiveawaysData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [partnerEmail, setPartnerEmail] = useState();
  const [cohort, setCohort] = useState();
  const [valueMin, setValueMin] = useState(null);
  const [valueMax, setValueMax] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [selectedGiveaway, setSelectedGiveaway] = useState(null); // "Все"
  const [selectedSubscription, setSelectedSubscription] = useState(null); // "Все"
  const [selectedCogort, setSelectedCogort] = useState(null); // "Все"
  const [selectedTask, setSelectedTask] = useState(null); // "Все"
  const [selectedPartner, setSelectedPartner] = useState(null); // "Все"
  const [filterTableVisible, setFilterTableVisible] = useState(true);

  const subscriptionOptions = [
    { label: "Все", value: null },
    { label: "Все подписки", value: "FULL" },
    { label: "Lite подписка", value: "LITE" },
    { label: "Pro подписка", value: "PRO" },
    { label: "Без подписки", value: "UNSUBSCRIBED" },
  ];

  const cogortsOptions = [{ label: "Все", value: null }];

  const partnerOptions = [{ label: "Все", value: null }];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getGiveaways = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/info/giveaways`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        setGiveawaysData(response.data);
        console.log("getGiveaways", response.data);
      } catch (error) {
        console.error("Error fetching giveaways:", error);
      }
    };
    getGiveaways();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/info/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        setTasksData(response.data);
        console.log("getTasks", response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, []);

  // useEffect(() => {
  //   const getGiveaways = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/giveaways/`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  //         },
  //         params: {
  //           page: 1,
  //           per_page: 1000,
  //         },
  //       });
  //       setGiveawaysData(response.data.items);
  //       console.log("getGiveaways", response.data.items);
  //     } catch (error) {
  //       console.error("Error fetching giveaways:", error);
  //     }
  //   };
  //   getGiveaways();
  // }, []);

  const handleFilterOption = () => {
    // Удаляем старые значения фильтров
    removeFilter("partner_email");
    removeFilter("cohort");
    removeFilter("min_balance");
    removeFilter("max_balance");
    removeFilter("datetime_start");
    removeFilter("datetime_end");

    // Добавляем только если есть значения
    if (partnerEmail !== null && partnerEmail !== "") {
      addFilter("partner_email", partnerEmail);
    }

    if (cohort !== null && cohort !== "") {
      addFilter("cohort", cohort);
    }

    if (valueMin !== null && valueMin !== "") {
      addFilter("min_balance", valueMin);
    }

    if (valueMax !== null && valueMax !== "") {
      addFilter("max_balance", valueMax);
    }

    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      addFilter("datetime_start", dateRange[0].format("YYYY-MM-DD HH:mm:ss"));
      addFilter("datetime_end", dateRange[1].format("YYYY-MM-DD HH:mm:ss"));
    }

    // В итоге отправляем один раз список всех активных фильтров
    setTimeout(() => {
      updateStatisticList(filterOptions);
    }, 0);
  };

  useEffect(() => {
    // Очистим фильтры в провайдере, как только компонент монтируется:
    clearFilters();

    // Сброс локальных полей:
    setPartnerEmail("");
    setCohort("");
    setValueMin(null);
    setValueMax(null);
    // (если ещё есть dateRange или другие поля, можно их тоже сбросить здесь,
    //  но раз вы сказали, что трогать остальные не нужно, опустим)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Определяем тип отображения на основе размера экрана
  const isMobile = windowSize > 480 && windowSize < 780;
  const isSmallMobile = windowSize < 480;

  // const debounceTimeout = useRef(null);

  // const debounceUpdate = useCallback(
  //   (newFilters) => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current);
  //     }
  //     debounceTimeout.current = setTimeout(() => {
  //       updateStatisticList(newFilters);
  //     }, 1500); // 500ms задержка
  //   },
  //   [updateStatisticList]
  // );
  const partnerEmailRef = useRef();
  const cohortRef = useRef();
  const valueMinRef = useRef();
  const valueMaxRef = useRef();

  const debounceRef = useRef(null);

  const scheduleDebouncedUpdate = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const partner = partnerEmailRef.current?.trim();
      const cohortVal = cohortRef.current?.trim();
      const minBal = valueMinRef.current;
      const maxBal = valueMaxRef.current;

      // 1) Сбрасываем старые фильтры:
      removeFilter("partner_email");
      removeFilter("cohort");
      removeFilter("min_balance");
      removeFilter("max_balance");

      // 2) Если поле непустое, снова добавляем:
      if (partner) addFilter("partner_email", partner);
      if (cohortVal) addFilter("cohort", cohortVal);
      if (minBal != null && minBal !== "") addFilter("min_balance", minBal);
      if (maxBal != null && maxBal !== "") addFilter("max_balance", maxBal);

      // ❌ УДАЛЕНО: Не вызываем updateStatisticList здесь! ❌
      //    DataGrid сам отреагирует, потому что prop `filters` = filterOptions поменялся.
    }, 500); // или 1500 ms — как вам удобнее
  };

  // const handlePartnerChange = (e) => {
  //   const value = e.target.value;
  //   setPartnerEmail(value);
  //   if (value !== "") {
  //     addFilter("partner_email", value);
  //   } else {
  //     removeFilter("partner_email");
  //   }

  //   debounceUpdate({ ...filterOptions, partner_email: value });
  // };

  // const handleCohortChange = (e) => {
  //   const value = e.target.value;
  //   setCohort(value);
  //   if (value !== "") {
  //     addFilter("cohort", value);
  //   } else {
  //     removeFilter("cohort");
  //   }

  //   debounceUpdate({ ...filterOptions, cohort: value });
  // };

  // const handleMinBalanceChange = (value) => {
  //   if (value !== "") {
  //     addFilter("min_balance", value);
  //   } else {
  //     removeFilter("min_balance");
  //   }

  //   debounceUpdate({ ...filterOptions, min_balance: value });
  // };

  // const handleMaxBalanceChange = (value) => {
  //   if (value !== "") {
  //     addFilter("max_balance", value);
  //   } else {
  //     removeFilter("max_balance");
  //   }

  //   debounceUpdate({ ...filterOptions, max_balance: value });
  // };

  // Обработчики ввода:
  const handleCohortChange = (e) => {
    const v = e.target.value;
    setCohort(v);
    cohortRef.current = v;
    scheduleDebouncedUpdate();
  };

  const handlePartnerChange = (e) => {
    const v = e.target.value;
    setPartnerEmail(v);
    partnerEmailRef.current = v;
    scheduleDebouncedUpdate();
  };

  const handleMinBalanceChange = (v) => {
    setValueMin(v);
    valueMinRef.current = v;
    scheduleDebouncedUpdate();
  };

  const handleMaxBalanceChange = (v) => {
    setValueMax(v);
    valueMaxRef.current = v;
    scheduleDebouncedUpdate();
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

      setDateRange([from, to]);
      setIsOpen(false);

      const formattedStart = from.format("YYYY-MM-DD HH:mm");
      const formattedEnd = to.format("YYYY-MM-DD HH:mm");

      addFilter("datetime_start", formattedStart);
      addFilter("datetime_end", formattedEnd);

      updateStatisticList({
        ...filterOptions,
        datetime_start: formattedStart,
        datetime_end: formattedEnd,
      });
    }
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined); // сброс временных
    setFromTime("00:00");
    setToTime("00:00");
    setDateRange([]); // ⬅️ сброс основного значения

    removeFilter("datetime_start"); // сброс фильтров
    removeFilter("datetime_end");

    updateStatisticList({
      ...filterOptions,
      datetime_start: undefined,
      datetime_end: undefined,
    });

    setIsOpen(false); // ⬅️ закрытие поповера, если требуется
  };

  return (
    <div style={{ zIndex: "1" }} className="mb-4">
      <div
        className="flex gap-3 items-center text-[#78829D] mt-6"
        onClick={() => setFilterTableVisible(!filterTableVisible)}
      >
        <div>Фильтры</div>
        <div className="border border-[#DBDFE9] w-full h-[1px]"></div>
        <div>
          {filterTableVisible ? (
            <div className="flex gap-1">
              свернуть <ChevronUp />
            </div>
          ) : (
            <div className="flex gap-1">
              развенуть <ChevronDown />
            </div>
          )}
        </div>
      </div>
      <div
        className={`${filterTableVisible === true ? "" : "hidden "}flex flex-col w-full mb-4 gap-5`}
      >
        <div
          className={`mt-5 ${isSmallMobile ? "flex flex-col gap-5" : "flex flex-col sm:flex-row gap-5"}`}
        >
          <div className="sm:w-1/3 relative">
            <div className="block lg:hidden">
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
                Дата и время
              </label>
              <FlexibleDateTimePicker
                mode="range"
                withTime={true}
                value={dateRange}
                onChange={(value) => {
                  setDateRange(value);

                  if (!value || value.length !== 2 || !value[0] || !value[1]) {
                    removeFilter("datetime_start");
                    removeFilter("datetime_end");
                    updateStatisticList({
                      ...filterOptions,
                      datetime_start: undefined,
                      datetime_end: undefined,
                    });
                  } else {
                    const [start, end] = value;
                    const formattedStart =
                      dayjs(start).format("YYYY-MM-DD HH:mm");
                    const formattedEnd = dayjs(end).format("YYYY-MM-DD HH:mm");

                    addFilter("datetime_start", formattedStart);
                    addFilter("datetime_end", formattedEnd);

                    updateStatisticList({
                      ...filterOptions,
                      datetime_start: formattedStart,
                      datetime_end: formattedEnd,
                    });
                  }
                }}
              />
            </div>
            <div className="hidden lg:flex">
              <CustomDateRangePicker
                date={{
                  from: dateRange?.[0]?.toDate?.(),
                  to: dateRange?.[1]?.toDate?.(),
                }}
                setDate={(range) => {
                  if (range?.from && range?.to) {
                    const [fh, fm] = fromTime.split(":").map(Number);
                    const [th, tm] = toTime.split(":").map(Number);

                    const from = dayjs(range.from).hour(fh).minute(fm);
                    const to = dayjs(range.to).hour(th).minute(tm);

                    setDateRange([from, to]);

                    const formattedStart = from.format("YYYY-MM-DD HH:mm");
                    const formattedEnd = to.format("YYYY-MM-DD HH:mm");

                    addFilter("datetime_start", formattedStart);
                    addFilter("datetime_end", formattedEnd);

                    updateStatisticList({
                      ...filterOptions,
                      datetime_start: formattedStart,
                      datetime_end: formattedEnd,
                    });
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
                defaultStartDate={dateRange?.[0]?.toDate?.() || new Date()}
                handleDateRangeApply={handleDateRangeApply}
                handleDateRangeReset={handleDateRangeReset}
                labelText="Дата и время"
              />
            </div>
          </div>
          <div className="sm:w-1/3 relative">
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
              Конкурс
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Конкурс"
              value={selectedGiveaway}
              onChange={(value) => {
                setSelectedGiveaway(value);
                if (value) {
                  addFilter("giveaway_id", value);
                } else {
                  removeFilter("giveaway_id");
                }
              }}
            >
              <Option value={undefined}>Все</Option>
              {giveawaysData.map((giveaway) => (
                <Option key={giveaway.id} value={giveaway.id}>
                  {/* ID:{giveaway.id} - "{giveaway.name}" */}
                  {giveaway.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="sm:w-1/3 relative">
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
              Когорта
            </label>
            <Input
              size="large"
              className="rounded-md text-sm w-full"
              // value={filterOptions.cohort}
              value={cohort}
              onChange={handleCohortChange}
            />
          </div>
        </div>
        <div
          className={`${isSmallMobile ? "flex flex-col gap-5" : "flex flex-col sm:flex-row gap-5"}`}
        >
          <div className="sm:w-1/3 relative">
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
              Задание
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Задание"
              value={selectedTask}
              onChange={(value) => {
                setSelectedTask(value);
                if (value) {
                  addFilter("task_id", value);
                } else {
                  removeFilter("task_id");
                }
              }}
            >
              <Option value={undefined}>Все</Option>
              {tasksData.map((task) => (
                <Option key={task.id} value={task.id}>
                  {/* ID:{giveaway.id} - "{giveaway.name}" */}
                  {task.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className="sm:w-1/3 relative">
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
              Партнер
            </label>
            <Input
              size="large"
              className="rounded-md text-sm w-full"
              value={partnerEmail}
              onChange={handlePartnerChange}
            />
          </div>
          <div className="sm:w-1/3 relative">
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
              Подписка GameSport
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              placeholder="Подписка GameSport"
              value={selectedSubscription}
              onChange={(value) => {
                setSelectedSubscription(value);

                if (value === null) {
                  removeFilter("gs_subscription");
                } else {
                  addFilter("gs_subscription", value);
                }
              }}
              options={subscriptionOptions}
            />
          </div>
        </div>
        <div
          className={`${isSmallMobile ? "flex flex-col gap-5" : "flex flex-col sm:flex-row gap-5"}`}
        >
          <div className="flex flex-row gap-5 w-full lg:w-1/3 pr-0 lg:pr-3">
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
                Билетов от
              </label>
              <InputNumber
                size="large"
                className="rounded-md text-sm w-full"
                // value={filterOptions.min_balance}
                value={valueMin}
                onChange={handleMinBalanceChange}
                min={0}
                controls={false}
              />
            </div>
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
                До
              </label>
              <InputNumber
                size="large"
                className="rounded-md text-sm w-full"
                // value={filterOptions.max_balance}
                value={valueMax}
                onChange={handleMaxBalanceChange}
                controls={false}
              />
            </div>
          </div>
          {/* <div
            style={{ marginTop: "24px" }}
            className="flex items-center gap-3"
          >
            <KeenIcon icon="question-2" />
            <button className="btn btn-light" onClick={handleFilterOption}>
              Искать
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
