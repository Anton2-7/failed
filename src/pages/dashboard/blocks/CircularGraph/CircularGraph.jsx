import React, { useState } from "react";
import Chart from "react-apexcharts";

export const CircularGraph = ({ data = [], dataType = "tasks" }) => {
  const [showAll, setShowAll] = useState(false);

  const colors = [
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
  ];

  const extractValue = (item) => {
    if (dataType === "tasks") return item?.started?.value ?? 0;
    if (dataType === "giveaways") return item?.users_count?.value ?? 0;
    return 0;
  };

  const extractLabel = (item) => {
    if (dataType === "tasks") return item?.title ?? "";
    if (dataType === "giveaways") return item?.name ?? "";
    return "";
  };

  const allLabels = data.map((item, index) => {
    const value = extractValue(item);
    const trend =
      dataType === "tasks" ? item?.started?.trend : item?.users_count?.trend;
    return {
      label: extractLabel(item),
      color: colors[index % colors.length],
      value,
      trend,
    };
  });

  const validForChart = allLabels.filter((item) => item.value > 0);
  const total = validForChart.reduce((sum, item) => sum + item.value, 0) || 1;
  const chartSeries = validForChart.map((item) =>
    Math.round((item.value / total) * 100)
  );

  const chartOptions = {
    chart: { type: "donut" },
    labels: validForChart.map((item) => item.label),
    colors: validForChart.map((item) => item.color),
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      y: { formatter: (val) => `${val}%` },
    },
    plotOptions: {
      pie: { donut: { size: "70%" } },
    },
  };

  const visibleItems = showAll ? allLabels : allLabels.slice(0, 5);

  return (
    <div className="flex items-start py-4 pr-10">
      {/* График */}
      <div className="w-[460px]">
        {validForChart.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            // width="100%"
          />
        ) : (
          <div className="text-sm text-gray-500">Нет данных для графика</div>
        )}
      </div>

      {/* Список */}
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-2">Задания</h3>
        <div className="space-y-2">
          {visibleItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center text-sm justify-between w-full"
            >
              <div className="flex items-center flex-grow gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {item.value > 0
                    ? `${Math.round((item.value / total) * 100)}%`
                    : "0%"}
                </span>
                {item.trend?.trend_value && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      item.trend.trend_direction
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.trend.trend_direction ? "↑" : "↓"}{" "}
                    {item.trend.trend_value}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка Ещё / Скрыть */}
        {allLabels.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-gray-600 mt-2 flex items-center gap-1 hover:underline"
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
            <span className="text-primary">{showAll ? "Скрыть" : "Ещё"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
