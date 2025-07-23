import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { DatePicker, Popover } from "antd";
import axios from "axios";
import { BASE_URL } from "../../../../static";
import dayjs from "../../dayjsConfig";
import { KeenIcon } from "../../../../components";
import { formatCategory } from "../../formatters";
import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../CustomRangePicker";

const { RangePicker } = DatePicker;

const ReferalChartCard = ({
  initialDateRange,
  grouping,
  onOpenFullSize,
  onCloseFullSize,
  isFullSize = false,
  dateRange,
  setDateRange,
}) => {
  const [tempDateRange, setTempDateRange] = useState(null);
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  // const [dateRange, setDateRange] = useState([startOfWeek, endOfWeek]);
  // const [dateRange, setDateRange] = useState(
  //   initialDateRange || [dayjs().startOf("week"), dayjs().endOf("week")]
  // );
  const [manualChange, setManualChange] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
          trend_value = "+100.00 %";
          trend_direction = true;
        } else if (prevValue === 0 && val.value === 0) {
          trend_value = "0.00 %";
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
    if (!manualChange && initialDateRange?.length === 2) {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange]);

  useEffect(() => {
    const getStatisticsData = async () => {
      try {
        const start = dayjs(dateRange[0]).format("YYYY-MM-DDTHH:mm");
        const end = dayjs(dateRange[1]).format("YYYY-MM-DDTHH:mm");

        const response = await axios.get(
          `${BASE_URL}/dashboards/graphs/referals?start=${start}&end=${end}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
            },
          }
        );

        let data = response.data.data;

        if (grouping === "week") {
          data = groupByWeekManual(data);
        } else if (grouping === "month") {
          data = groupByMonth(data);
        }

        const parsedData = Object.entries(data).map(([date, details]) => ({
          date,
          value: details.value,
          trendValue: details.trend?.trend_value || "",
          trendDirection: details.trend?.trend_direction ?? true,
        }));

        setChartData(parsedData.map((item) => item.value));
        setCategories(
          parsedData.map((item) => formatCategory(item.date, grouping))
        );
        setTrendData(parsedData.map((item) => item));
      } catch (error) {
        console.error(error);
      }
    };

    getStatisticsData();
  }, [dateRange, grouping]);

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
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
        className={`flex gap-4 justify-between items-center border-b ${isFullSize ? "px-0" : "px-8"} pb-2`}
      >
        <p className="font-semibold text-base" style={{ color: "#071437" }}>
          Приглашено рефералов
        </p>

        <div className="flex gap-6 items-center text-[#99A1B7]">
          {/* {Array.isArray(dateRange) && dateRange.length === 2 && (
            <div className="hidden lg:block text-sm text-gray-500 ">
              Выбранный диапазон:{" "}
              {dayjs(dateRange[0]).format("YYYY-MM-DD HH:mm")} —{" "}
              {dayjs(dateRange[1]).format("YYYY-MM-DD HH:mm")}
            </div>
          )} */}

          <CustomDateRangePicker
            iconOnly
            customTrigger={
              <button onClick={() => setShowDatePicker(!showDatePicker)}>
                <KeenIcon className="text-2xl" icon="calendar" />
              </button>
            }
            date={{
              from: dateRange?.[0]?.toDate?.(),
              to: dateRange?.[1]?.toDate?.(),
            }}
            setDate={(range) => {
              if (range?.from && range?.to) {
                const from = dayjs(range.from)
                  .hour(Number(fromTime.split(":")[0]))
                  .minute(Number(fromTime.split(":")[1]));
                const to = dayjs(range.to)
                  .hour(Number(toTime.split(":")[0]))
                  .minute(Number(toTime.split(":")[1]));
                setManualChange(true);
                setDateRange([from, to]);
              }
            }}
            tempDateRange={tempDateRange}
            setTempDateRange={setTempDateRange}
            fromTime={fromTime}
            setFromTime={setFromTime}
            toTime={toTime}
            setToTime={setToTime}
            isOpen={showDatePicker}
            setIsOpen={setShowDatePicker}
            handleDateRangeApply={() => {
              if (!tempDateRange?.from || !tempDateRange?.to) return;
              const from = dayjs(tempDateRange.from)
                .hour(Number(fromTime.split(":")[0]))
                .minute(Number(fromTime.split(":")[1]));
              const to = dayjs(tempDateRange.to)
                .hour(Number(toTime.split(":")[0]))
                .minute(Number(toTime.split(":")[1]));
              setManualChange(true);
              setDateRange([from, to]);
              setShowDatePicker(false);
            }}
            handleDateRangeReset={() => {
              setTempDateRange(null);
              setDateRange([]);
              setShowDatePicker(false);
            }}
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
      {showDatePicker && (
        <div className="w-full px-6 mt-2 lg:mt-0">
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

export default ReferalChartCard;
