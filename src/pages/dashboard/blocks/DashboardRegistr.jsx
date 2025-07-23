import arrowUp from "../../../assets/icons/dashboardinfo/arrow-up.svg";
import arrowDown from "../../../assets/icons/dashboardinfo/arrow-down.svg";
import { useEffect, useState } from "react";
import { DashboardInfoContainer } from "./dashboardinfo/DashboardInfoСontainer";
import userTick from "../../../assets/icons/dashboardinfo/user-tick.svg";
import axios from "axios";
import { BASE_URL } from "../../../static";

export const DashboardRegistr = ({ period }) => {
  const [data, setData] = useState({
    registrations: {
      origin: {
        value: 0,
        trend: {
          trend_value: "0%",
          trend_direction: true,
        },
      },
      referals: {
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
    <DashboardInfoContainer title="Регистрации">
      <img className="mt-2 lg:mt-0" src={userTick} alt="user" />

      <div className="flex flex-wrap gap-5">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Прямые</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.registrations.origin.value}
              </p>
              {trendIndicator(data.registrations.origin.trend)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Реферальные</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.registrations.referals.value}
              </p>
              {trendIndicator(data.registrations.referals.trend)}
            </div>
          </div>
        </div>
      </div>
    </DashboardInfoContainer>
  );
};
