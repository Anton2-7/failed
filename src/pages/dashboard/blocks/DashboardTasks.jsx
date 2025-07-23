import arrowUp from "../../../assets/icons/dashboardinfo/arrow-up.svg";
import arrowDown from "../../../assets/icons/dashboardinfo/arrow-down.svg";
import book from "../../../assets/icons/dashboardinfo/book.svg";
import { useEffect, useState } from "react";
import { DashboardInfoContainer } from "./dashboardinfo/DashboardInfoСontainer";
import axios from "axios";
import { BASE_URL } from "../../../static";

export const DashboardTasks = ({ period }) => {
  const [data, setData] = useState({
    tasks: {
      started: {
        value: 0,
        trend: {
          trend_value: "0%",
          trend_direction: true,
        },
      },
      completed: {
        value: 0,
        trend: {
          trend_value: "0%",
          trend_direction: true,
        },
      },
    },
  });

  useEffect(() => {
    const getGeneralStats = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/dashboards/general_stats?period=${period}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getGeneralStats();
  }, [period]);

  const trendIndicator = (trend) => {
    const isPositive = trend.trend_direction;
    const arrowIcon = isPositive ? arrowUp : arrowDown;
    const colorBack = isPositive ? "bg-[#EAFFF1]" : "bg-[#FFEEF3]";
    const colorText = isPositive ? "text-[#17C653]" : "text-[#F8285A]";
    return (
      <div
        className={`flex gap-[3px] p-[7px] ${colorBack} rounded-md items-center`}
      >
        <img className="w-[10px]" src={arrowIcon} alt="arrow" />
        <span className={`${colorText} text-xs font-semibold`}>
          {trend.trend_value}
        </span>
      </div>
    );
  };
  return (
    <DashboardInfoContainer title="Задания">
      <img className="mt-2 lg:mt-0" src={book} alt="book" />

      <div className="flex flex-wrap gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Начато</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.tasks.started.value}
              </p>
              {trendIndicator(data.tasks.started.trend)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Выполнено</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.tasks.completed.value}
              </p>
              {trendIndicator(data.tasks.completed.trend)}
            </div>
          </div>
        </div>
      </div>
    </DashboardInfoContainer>
  );
};
