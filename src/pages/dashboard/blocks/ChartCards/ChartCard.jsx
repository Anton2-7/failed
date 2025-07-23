import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { DatePicker, Select } from "antd";
import axios from "axios";
import { BASE_URL } from "../../../../static";
import dayjs from "../../dayjsConfig";
import { KeenIcon } from "../../../../components";
import { formatCategory } from "../../formatters";
import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../CustomRangePicker";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ChartWithDateRange = ({
  initialDateRange,
  grouping,
  onOpenFullSize,
  onCloseFullSize,
  isFullSize = false,
  dateRange,
  setDateRange,
}) => {
  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  const [selectedGiveaway, setSelectedGiveaway] = useState(0);
  // const [dateRange, setDateRange] = useState([startOfWeek, endOfWeek]);
  // const [dateRange, setDateRange] = useState(
  //   initialDateRange || [dayjs().startOf("week"), dayjs().endOf("week")]
  // );
  const [manualChange, setManualChange] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState({
    from: dateRange[0]?.toDate?.() || dateRange[0]?.toDate?.() || new Date(),
    to: dateRange[1]?.toDate?.() || dateRange[1]?.toDate?.() || new Date(),
  });
  const [fromTime, setFromTime] = useState(
    dateRange[0]?.format("HH:mm") || "00:00"
  );
  const [toTime, setToTime] = useState(
    dateRange[1]?.format("HH:mm") || "23:59"
  );

  const handleDateRangeApply = () => {
    if (!tempDateRange?.from || !tempDateRange?.to) return;
    const from = dayjs(tempDateRange.from)
      .hour(+fromTime.split(":")[0])
      .minute(+fromTime.split(":")[1]);
    const to = dayjs(tempDateRange.to)
      .hour(+toTime.split(":")[0])
      .minute(+toTime.split(":")[1]);

    setDateRange([from, to]);
    setManualChange(true);
    setIsOpen(false);
  };

  const handleDateRangeReset = () => {
    setTempDateRange(undefined);
    setDateRange([]);
    setManualChange(true);
    setIsOpen(false);
  };

  const giveawaysData = [
    { id: 0, name: "Все", value: "ALL" },
    { id: 1, name: "Новые", value: "NEW" },
    { id: 2, name: "Повторные", value: "REPEATED" },
  ];

  useEffect(() => {
    if (!manualChange && initialDateRange?.length === 2) {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange]);

  const groupByWeekManual = (data) => {
    const grouped = {};

    Object.entries(data).forEach(([dateStr, val]) => {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj)) {
        console.warn("❌ Невалидная дата:", dateStr);
        return;
      }

      // Получаем понедельник этой недели (начало недели)
      const monday = new Date(dateObj);
      const day = monday.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      monday.setDate(monday.getDate() + diff);
      monday.setHours(0, 0, 0, 0);

      const weekKey = monday.toISOString().split("T")[0]; // YYYY-MM-DD (понедельник)

      if (!grouped[weekKey]) {
        grouped[weekKey] = {
          value: 0,
          date: monday,
        };
      }

      grouped[weekKey].value += val.value;
    });

    // Сортировка по дате
    const sortedEntries = Object.entries(grouped).sort(([, a], [, b]) =>
      a.date > b.date ? 1 : -1
    );

    let prevValue = null;
    const finalGrouped = {};

    sortedEntries.forEach(([weekKey, val]) => {
      let trend_value = "";
      let trend_direction = true;

      if (prevValue !== null) {
        if (prevValue === 0 && val.value > 0) {
          trend_value = "+100 %";
          trend_direction = true;
        } else if (prevValue === 0 && val.value === 0) {
          trend_value = "0 %";
          trend_direction = true;
        } else {
          const percent = ((val.value - prevValue) / prevValue) * 100;
          trend_value = `${percent >= 0 ? "+" : ""}${percent.toFixed(2)} %`;
          trend_direction = percent >= 0;
        }
      }

      finalGrouped[weekKey] = {
        value: val.value,
        trend: {
          trend_value,
          trend_direction,
        },
        date: val.date,
      };

      prevValue = val.value;
    });

    return finalGrouped;
  };

  const groupByMonth = (data) => {
    const grouped = {};

    // Суммируем значения по месяцам
    Object.entries(data).forEach(([dateStr, val]) => {
      const monthKey = dayjs(dateStr).startOf("month").format("YYYY-MM");
      if (!grouped[monthKey]) {
        grouped[monthKey] = { value: 0 };
      }
      grouped[monthKey].value += val.value;
    });

    // Сортировка и расчет тренда
    const sortedEntries = Object.entries(grouped).sort(([a], [b]) =>
      dayjs(a).isAfter(dayjs(b)) ? 1 : -1
    );

    let prevValue = null;
    const finalGrouped = {};

    sortedEntries.forEach(([monthKey, val]) => {
      let trend_value = "";
      let trend_direction = true;

      if (prevValue !== null) {
        if (prevValue === 0 && val.value > 0) {
          trend_value = "+100 %";
          trend_direction = true;
        } else if (prevValue === 0 && val.value === 0) {
          trend_value = "0 %";
          trend_direction = true;
        } else {
          const percent = ((val.value - prevValue) / prevValue) * 100;
          trend_value = `${percent >= 0 ? "+" : ""}${percent.toFixed(2)} %`;
          trend_direction = percent >= 0;
        }
      }

      finalGrouped[monthKey] = {
        value: val.value,
        trend: {
          trend_value,
          trend_direction,
        },
      };

      prevValue = val.value;
    });

    return finalGrouped;
  };

  useEffect(() => {
    const getStatisticsData = async () => {
      try {
        const preset = giveawaysData[selectedGiveaway]?.value || "ALL";
        console.log("🎯 dateRange[0]", dateRange[0], typeof dateRange[0]);

        const start = dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm");
        const end = dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm");

        const url = `${BASE_URL}/dashboards/graphs/users?start=${start}&end=${end}&preset=${preset}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });

        let data = response.data.data;

        // Применяем группировку
        if (grouping === "week") {
          data = groupByWeekManual(data);
        } else if (grouping === "month") {
          data = groupByMonth(data);
        }

        const parsedData = Object.entries(data).map(([date, details]) => ({
          date, // Это агрегированный ключ, например "2025-W20"
          originalDate: details.date || date, // Сохраняем оригинальную дату (если была)
          value: details.value,
          trendValue: details.trend?.trend_value || "",
          trendDirection: details.trend?.trend_direction ?? true,
        }));

        setChartData(parsedData.map((item) => item.value));
        console.log(chartData, "chartData");
        setCategories(
          parsedData.map((item) => formatCategory(item.date, grouping))
        );

        setTrendData(parsedData.map((item) => item));
      } catch (error) {
        console.error(error);
      }
    };

    getStatisticsData();
  }, [dateRange, grouping, selectedGiveaway]);

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      stacked: false,
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 3,
      position: "back",
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const trend = trendData[dataPointIndex];
        const label = w.globals.labels[dataPointIndex];
        const percentValue = trend.trendValue.replace(
          /([+-]?\d+)\.\d+ %/,
          "$1%"
        );

        const monthName = dayjs(trend.originalDate).format("MMMM");
        const capitalizedMonth =
          monthName.charAt(0).toUpperCase() + monthName.slice(1);

        const color = trend.trendDirection ? "#17C653" : "#F8285A";
        const bgColor = trend.trendDirection
          ? "rgba(23, 198, 83, 0.1)"
          : "rgba(248, 40, 90, 0.1)";
        const borderColor = trend.trendDirection ? "#17C65333" : "#F8B6C6";

        return `
      <div style="
        display: flex;
        flex-direction: column;
        padding: 6px 12px;
        gap: 6px;
        border-radius: 8px;
        background: white;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.06);
        font-family: Inter, sans-serif;
        text-align: left;
      ">
        <div style="font-size: 13px; font-weight: 400; color: #4B5675;">
          ${capitalizedMonth}, ${dayjs(trend.originalDate).format("YYYY")} Оплаты
        </div>
        <div style="display: flex; align-items: center; gap: 7px;">
        <div style="font-size: 15px; font-weight: 600; color: #071437;">
          ${value}
        </div>
        <div style="display: flex; 
                    align-items: center;
                    background: ${bgColor};
                    color: ${color};
                    border: 1px solid ${borderColor};
                    border-radius: 4px;
                    padding: 0px 3px;
                    font-size: 10px;
                    height: 16px;
                    font-weight: 500;">
          ${percentValue}
        </div>
        </div>
      </div>
    `;
      },
    },
    markers: {
      size: 0,
      colors: ["#fff"],
      strokeColor: "#1B84FF",
      strokeWidth: 3,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#1B84FF"],
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: "12px", colors: "#78829D" } },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      labels: { style: { fontSize: "12px", colors: "#78829D" } },
    },
  };

  return (
    <div
      className={`bg-white rounded-xl shadow ${isFullSize ? "pt-1" : "pt-2"}`}
    >
      <div
        className={`hidden lg:flex gap-4 items-center justify-between border-b ${isFullSize ? "px-0" : "px-8"} pb-2`}
      >
        <p className="font-semibold text-base" style={{ color: "#071437" }}>
          Пользователи
        </p>

        <div className="w-[201px] relative">
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
            Тип пользователей
          </label>
          <Select
            className="input ps-0 pe-0 border-none"
            placeholder="Пользователи"
            value={selectedGiveaway}
            onChange={(value) => setSelectedGiveaway(value)}
          >
            {giveawaysData.map((giveaway) => (
              <Option key={giveaway.id} value={giveaway.id}>
                {giveaway.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex gap-6 items-center text-[#99A1B7]">
          <CustomDateRangePicker
            iconOnly
            customTrigger={
              <button>
                <KeenIcon className="text-2xl" icon="calendar" />
              </button>
            }
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
            handleDateRangeApply={handleDateRangeApply}
            handleDateRangeReset={handleDateRangeReset}
          />

          {isFullSize ? (
            <button onClick={() => onCloseFullSize?.()}>
              <KeenIcon className="text-2xl" icon="cross-square" />
            </button>
          ) : (
            <button
              className="max-[1024px]:hidden"
              onClick={() =>
                typeof onOpenFullSize === "function" && onOpenFullSize()
              }
            >
              <KeenIcon className="text-2xl" icon="exit-right-corner" />
            </button>
          )}
        </div>
      </div>
      <div className="lg:hidden flex flex-col gap-2 items-center border-b px-8 pb-2">
        <div className="flex justify-between w-full items-center">
          <p className="font-semibold text-base" style={{ color: "#071437" }}>
            Пользователи
          </p>

          <div className="flex gap-6 items-center text-[#99A1B7]">
            <button onClick={() => setShowDatePicker(!showDatePicker)}>
              <KeenIcon className="text-2xl" icon="calendar" />
            </button>
          </div>
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
            Тип пользователей
          </label>
          <Select
            className="input ps-0 pe-0 border-none"
            placeholder="Пользователи"
            value={selectedGiveaway}
            onChange={(value) => setSelectedGiveaway(value)}
          >
            {giveawaysData.map((giveaway) => (
              <Option key={giveaway.id} value={giveaway.id}>
                {giveaway.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {showDatePicker && (
        <div className="w-full px-6 mt-2">
          {/* <RangePicker
            className="hidden lg:flex w-full mb-4"
            showTime
            format="YYYY-MM-DD HH:mm"
            value={manualChange ? dateRange : null}
            onChange={(dates) => {
              setManualChange(true);
              setDateRange(dates);
            }}
          /> */}

          <div className="block lg:hidden px-2">
            <FlexibleDateTimePicker
              mode="range"
              withTime={true}
              value={dateRange}
              onChange={(dates) => {
                setManualChange(true);
                setDateRange(dates);
              }}
            />
          </div>
        </div>
      )}

      <div className={`${isFullSize ? "px-0" : "px-6"}`}>
        <ReactApexChart
          options={options}
          series={[{ name: "Оплаты", data: chartData }]}
          type="line"
          height={isFullSize ? 500 : 286}
          width="100%"
        />
      </div>
    </div>
  );
};

export default ChartWithDateRange;

// ChartCard.jsx
// import { useState, useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
// import { DatePicker, Select } from "antd";
// import axios from "axios";
// import { BASE_URL } from "../../../../static";
// import dayjs from "dayjs";
// import isoWeek from "dayjs/plugin/isoWeek";
// import weekOfYear from "dayjs/plugin/weekOfYear";
// dayjs.extend(isoWeek);
// dayjs.extend(weekOfYear);
// import { KeenIcon } from "../../../../components";
// import { formatCategory } from "../../formatters";
// import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";

// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const ChartWithDateRange = ({
//   initialDateRange,
//   grouping,
//   onOpenFullSize,
//   onCloseFullSize,
//   isFullSize = false,
// }) => {
//   const startOfWeek = dayjs().startOf("week");
//   const endOfWeek = dayjs().endOf("week");

//   const [selectedGiveaway, setSelectedGiveaway] = useState(0);
//   const [dateRange, setDateRange] = useState(
//     initialDateRange || [dayjs().startOf("week"), dayjs().endOf("week")]
//   );
//   const [manualChange, setManualChange] = useState(false);

//   const [chartData, setChartData] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [trendData, setTrendData] = useState([]);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const giveawaysData = [
//     { id: 0, name: "Все", value: "ALL" },
//     { id: 1, name: "Новые", value: "NEW" },
//     { id: 2, name: "Повторные", value: "REPEATED" },
//   ];

//   useEffect(() => {
//     if (!manualChange && initialDateRange?.length === 2) {
//       setDateRange(initialDateRange);
//     }
//   }, [initialDateRange]);

//   const groupByMonth = (data) => {
//     const grouped = {};
//     Object.entries(data).forEach(([dateStr, val]) => {
//       const monthKey = dayjs(dateStr).startOf("month").format("YYYY-MM");
//       if (!grouped[monthKey]) grouped[monthKey] = { value: 0 };
//       grouped[monthKey].value += val.value;
//     });

//     const sortedEntries = Object.entries(grouped).sort(([a], [b]) =>
//       dayjs(a).isAfter(dayjs(b)) ? 1 : -1
//     );

//     let prevValue = null;
//     const finalGrouped = {};

//     sortedEntries.forEach(([monthKey, val]) => {
//       let trend_value = "";
//       let trend_direction = true;

//       if (prevValue !== null) {
//         if (prevValue === 0 && val.value > 0) {
//           trend_value = "+100.00 %";
//         } else if (prevValue === 0) {
//           trend_value = "0.00 %";
//         } else {
//           const percent = ((val.value - prevValue) / prevValue) * 100;
//           trend_value = `${percent >= 0 ? "+" : ""}${percent.toFixed(2)} %`;
//           trend_direction = percent >= 0;
//         }
//       }

//       finalGrouped[monthKey] = {
//         value: val.value,
//         trend: { trend_value, trend_direction },
//       };

//       prevValue = val.value;
//     });

//     return finalGrouped;
//   };

//   useEffect(() => {
//     const getStatisticsData = async () => {
//       try {
//         const preset = giveawaysData[selectedGiveaway]?.value || "ALL";
//         const start = dateRange[0].format("YYYY-MM-DDTHH:mm");
//         const end = dateRange[1].format("YYYY-MM-DDTHH:mm");

//         const url = `${BASE_URL}/dashboards/graphs/users?start=${start}&end=${end}&preset=${preset}`;

//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
//           },
//         });

//         let data = response.data.data;
//         if (grouping === "month") data = groupByMonth(data);

//         const parsedData = Object.entries(data).map(([date, details]) => ({
//           date,
//           value: details.value,
//           trendValue: details.trend?.trend_value || "",
//           trendDirection: details.trend?.trend_direction ?? true,
//         }));

//         setChartData(parsedData.map((item) => item.value));
//         setCategories(
//           parsedData.map((item) => formatCategory(item.date, grouping))
//         );
//         setTrendData(parsedData.map((item) => item));
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     getStatisticsData();
//   }, [dateRange, grouping, selectedGiveaway]);

//   const options = {
//     chart: {
//       type: "line",
//       height: isFullSize ? 500 : 350,
//       toolbar: { show: false },
//       zoom: { enabled: false },
//     },
//     tooltip: {
//       y: {
//         formatter: (val, { dataPointIndex }) => {
//           const trend = trendData[dataPointIndex];
//           const color = trend.trendDirection ? "#17C653" : "#F8285A";
//           const symbol = trend.trendValue;
//           return `<div style="display: flex; gap: 5px; align-items: center">${val.toFixed(
//             2
//           )} <div style="color:${color}; border:1px solid ${color}; border-radius: 4px; padding: 0 2px">${symbol}</div></div>`;
//         },
//       },
//     },
//     markers: {
//       size: 0,
//       colors: ["#fff"],
//       strokeColor: "#3b82f6",
//       strokeWidth: 3,
//     },
//     stroke: {
//       curve: "smooth",
//       width: 3,
//       colors: ["#3b82f6"],
//     },
//     xaxis: {
//       categories: categories,
//       labels: { style: { fontSize: "12px" } },
//     },
//     yaxis: {
//       min: 0,
//       labels: { style: { fontSize: "12px" } },
//     },
//   };

//   return (
//     <div className="bg-white rounded-xl shadow pt-2">
//       <div className="flex gap-4 items-center justify-between border-b px-8 pb-2">
//         <p className="font-semibold text-base" style={{ color: "#071437" }}>
//           Пользователи
//         </p>

//         <div className="w-[201px] relative">
//           <label
//             style={{
//               color: "#99A1B7",
//               fontSize: "11px",
//               display: "inline",
//               marginBottom: "0px",
//             }}
//             className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
//           >
//             Тип пользователей
//           </label>
//           <Select
//             className="input ps-0 pe-0 border-none"
//             placeholder="Пользователи"
//             value={selectedGiveaway}
//             onChange={(value) => setSelectedGiveaway(value)}
//           >
//             {giveawaysData.map((giveaway) => (
//               <Option key={giveaway.id} value={giveaway.id}>
//                 {giveaway.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         <div className="flex gap-6 items-center text-[#99A1B7]">
//           <button onClick={() => setShowDatePicker(!showDatePicker)}>
//             <KeenIcon className="text-2xl" icon="calendar" />
//           </button>
//           {isFullSize ? (
//             <button onClick={() => onCloseFullSize?.()}>
//               <KeenIcon className="text-2xl" icon="cross-square" />
//             </button>
//           ) : (
//             <button
//               onClick={() =>
//                 typeof onOpenFullSize === "function" && onOpenFullSize()
//               }
//             >
//               <KeenIcon className="text-2xl" icon="exit-right-corner" />
//             </button>
//           )}
//         </div>
//       </div>

//       {showDatePicker && (
//         <div className="w-full px-6 mt-2">
//           <RangePicker
//             className="w-full mb-4"
//             showTime
//             format="YYYY-MM-DD HH:mm"
//             value={manualChange ? dateRange : null}
//             onChange={(dates) => {
//               setManualChange(true);
//               setDateRange(dates);
//             }}
//           />
//         </div>
//       )}

//       <div className="px-6">
//         <ReactApexChart
//           options={options}
//           series={[{ name: "Оплаты", data: chartData }]}
//           type="line"
//           height={isFullSize ? 450 : 286}
//           width="100%"
//         />
//       </div>
//     </div>
//   );
// };

// export default ChartWithDateRange;
