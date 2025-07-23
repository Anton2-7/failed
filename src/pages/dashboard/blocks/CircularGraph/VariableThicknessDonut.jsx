import React, { useState, useEffect } from "react";
import { Tooltip, DatePicker, Popover } from "antd";
import axios from "axios";
import dayjs from "../../dayjsConfig";
import { KeenIcon } from "@/components";
const { RangePicker } = DatePicker;
import ArrowUp from "../../../../assets/arrow-up.png";
import ArrowDown from "../../../../assets/arrow-down.png";
import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { CustomDateRangePicker } from "../CustomRangePicker";

const VariableThicknessDonut = ({
  fetchUrl,
  size = 200,
  minThickness = 8,
  maxThickness = 30,
  title,
  initialDateRange,
  onOpenFullSize,
  onCloseFullSize,
  isFullSize = false,
  dateRange,
  setDateRange,
}) => {
  const [tempDateRange, setTempDateRange] = useState(null);
  const [fromTime, setFromTime] = useState("00:00");
  const [toTime, setToTime] = useState("23:59");
  const [showAll, setShowAll] = useState(false);
  // const [dateRange, setDateRange] = useState(
  //   initialDateRange || [dayjs().subtract(7, "day"), dayjs().startOf("day")]
  // );
  const [manualChange, setManualChange] = useState(false);
  const [data, setData] = useState([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!manualChange && initialDateRange?.length === 2) {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange]);

  useEffect(() => {
    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      const url = `${fetchUrl}?start=${dayjs(start).format("YYYY-MM-DDTHH:mm")}&end=${dayjs(end).format("YYYY-MM-DDTHH:mm")}`;
      axios.get(url).then((res) => {
        setData(
          res.data.map((item, index) => ({
            label: item.title || item.name || "—",
            value: item?.completed?.value ?? item?.users_count?.value ?? 0,
            trend: item?.completed?.trend ?? item?.users_count?.trend,
            color: [
              "#1E90FF",
              "#FFA500",
              "#32CD32",
              "#9932CC",
              "#FFD700",
              "#FF69B4",
              "#8A2BE2",
              "#00CED1",
              "#FF4500",
              "#7FFF00",
            ][index % 10],
          }))
        );
      });
    }
  }, [dateRange, fetchUrl]);

  const gap = 3;

  const normalizedData = data.map((d) => ({
    ...d,
    value: Number(d.value),
  }));

  const filteredData = normalizedData.filter((d) => d.value > 0);
  const allZero = normalizedData.every((item) => item.value === 0);

  const totalGap = gap * filteredData.length;
  const totalAvailable = 360 - totalGap;

  const maxValue = Math.max(...filteredData.map((d) => d.value), 1);
  const totalValueForGraph =
    filteredData.reduce((sum, d) => sum + d.value, 0) || 1;
  const totalValueForList =
    normalizedData.reduce((sum, d) => sum + d.value, 0) || 1;

  const toRadians = (deg) => (deg * Math.PI) / 180;

  const describeArc = (x, y, rInner, rOuter, startAngle, endAngle) => {
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const startInner = {
      x: x + rInner * Math.cos(toRadians(endAngle)),
      y: y + rInner * Math.sin(toRadians(endAngle)),
    };
    const endInner = {
      x: x + rInner * Math.cos(toRadians(startAngle)),
      y: y + rInner * Math.sin(toRadians(startAngle)),
    };
    const startOuter = {
      x: x + rOuter * Math.cos(toRadians(startAngle)),
      y: y + rOuter * Math.sin(toRadians(startAngle)),
    };
    const endOuter = {
      x: x + rOuter * Math.cos(toRadians(endAngle)),
      y: y + rOuter * Math.sin(toRadians(endAngle)),
    };

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
      "Z",
    ].join(" ");
  };

  let cumulativeAngle = 0;

  const adjustedSize = size;

  const center = adjustedSize / 2;
  const outerRadius = size / 2;
  const visibleData = showAll ? normalizedData : normalizedData.slice(0, 5);

  return (
    <div
      style={{ boxShadow: "0px 3px 4px 0px rgba(0, 0, 0, 0.03)" }}
      className={`rounded-xl ${isFullSize ? "" : "border border-[#F1F1F4]"} bg-[#FFFFFF] w-full`}
    >
      <div className="flex flex-col">
        <div
          className={`card-header ${isFullSize ? "px-0" : "px-8"} flex gap-4 justify-between`}
        >
          <h3 className="card-title">{title}</h3>
          <div className="flex text-xl text-[#99A1B7] gap-6 items-center relative">
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

        <div
          className={`flex flex-col lg:flex-row items-start ${isFullSize ? "p-0 pt-4" : "p-8"} gap-y-4`}
        >
          {/* График */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-start">
            <div
              className="flex items-start"
              style={{
                width: `${adjustedSize}px`,
                height: `${adjustedSize}px`,
                minWidth: `${adjustedSize}px`,
                minHeight: `${adjustedSize}px`,
              }}
            >
              {allZero ? (
                <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                  Нет данных
                </div>
              ) : (
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${adjustedSize} ${adjustedSize}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {filteredData.map((slice, index) => {
                    const sliceAngle =
                      (slice.value / totalValueForGraph) * totalAvailable;
                    const startAngle = cumulativeAngle;
                    const endAngle = cumulativeAngle + sliceAngle;
                    cumulativeAngle += sliceAngle + gap;

                    const thickness =
                      minThickness +
                      (slice.value / maxValue) * (maxThickness - minThickness);
                    const rOuter = outerRadius;
                    const rInner = rOuter - thickness;

                    const path = describeArc(
                      center,
                      center,
                      rInner,
                      rOuter,
                      startAngle,
                      endAngle
                    );

                    return (
                      <Tooltip
                        key={index}
                        title={`${slice.label} (${slice.value})`}
                        overlayInnerStyle={{ color: "#071437" }}
                        overlayClassName="font-bold"
                        color="white"
                      >
                        <path d={path} fill={slice.color} />
                      </Tooltip>
                    );
                  })}
                  <circle
                    cx={center}
                    cy={center}
                    r={outerRadius - maxThickness - 1}
                    fill="white"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Список */}
          <div className="w-full pl-0 lg:pl-8 flex flex-col justify-between">
            <div className="space-y-2.5">
              {visibleData.map((item, idx) => {
                const percent =
                  item.value > 0
                    ? `${Math.round((item.value / totalValueForList) * 100)}%`
                    : "0%";

                return (
                  <div className="flex items-center text-sm" key={idx}>
                    <div className="flex items-center gap-1.5 flex-grow min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="truncate block max-w-[160px] min-[1650px]:max-w-[320px] min-[1700px]:max-w-[320px] min-[1024px]:max-w-[180px] min-[1440px]:max-w-[100px] min-[1200px]:max-w-[100px] min-[1100px]:max-w-[50px]">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="font-semibold whitespace-nowrap">
                        {percent}
                      </div>
                      {item.trend?.trend_value && (
                        <span
                          className={`min-w-[90px] text-xs px-2 py-0.5 rounded-md flex gap-1 items-center justify-between whitespace-nowrap ${
                            item.trend.trend_direction
                              ? "bg-[#EAFFF1] text-[#17C653]"
                              : "bg-[#FFEEF3] text-[#F8285A]"
                          }`}
                        >
                          <img
                            src={
                              item.trend.trend_direction ? ArrowUp : ArrowDown
                            }
                            className="w-[10px] h-[10px]"
                          />
                          {item.trend.trend_value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {normalizedData.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-gray-600 mt-2 flex items-center gap-1 hover:underline pb-0 lg:pb-4"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showAll ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="text-primary">
                  {showAll ? "Скрыть" : "Ещё"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableThicknessDonut;
