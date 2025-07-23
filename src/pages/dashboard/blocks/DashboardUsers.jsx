import dubleCheck from "../../../assets/icons/dashboardinfo/double-check-circle.svg";
import arrowUp from "../../../assets/icons/dashboardinfo/arrow-up.svg";
import arrowDown from "../../../assets/icons/dashboardinfo/arrow-down.svg";
import { useEffect, useState } from "react";
import { DashboardInfoContainer } from "./dashboardinfo/DashboardInfoСontainer";
import axios from "axios";
import { BASE_URL } from "../../../static";

export const DashboardUsers = ({ period }) => {
  const [users, setUsers] = useState({
    totalUsers: 0,
    newUsers: 0,
    repeatedUsers: 0,
    totalTrend: { value: "0%", direction: true },
    newTrend: { value: "0%", direction: true },
    repeatedTrend: { value: "0%", direction: true },
  });

  useEffect(() => {
    const getGenetalStats = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/dashboards/general_stats?period=${period}`
        );
        const usersData = response.data.users;
        setUsers({
          totalUsers: usersData.total.value,
          newUsers: usersData.new.value,
          repeatedUsers: usersData.repeated.value,
          totalTrend: {
            value: usersData.total.trend.trend_value,
            direction: usersData.total.trend.trend_direction,
          },
          newTrend: {
            value: usersData.new.trend.trend_value,
            direction: usersData.new.trend.trend_direction,
          },
          repeatedTrend: {
            value: usersData.repeated.trend.trend_value,
            direction: usersData.repeated.trend.trend_direction,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };
    getGenetalStats();
  }, [period]);

  const trendIndicator = (trend) => {
    const isPositive = trend.direction;
    const arrowIcon = isPositive ? arrowUp : arrowDown;
    const colorBack = isPositive ? "bg-[#EAFFF1]" : "bg-[#FFEEF3]";
    const colorText = isPositive ? "text-[#17C653]" : "text-[#F8285A]";
    return (
      <div
        className={`flex gap-[3px] p-[7px] ${colorBack} rounded-md items-center`}
      >
        <img className="w-[10px]" src={arrowIcon} alt="arrowup" />
        <span className={`${colorText} text-xs font-semibold`}>
          {trend.value}
        </span>
      </div>
    );
  };

  return (
    <DashboardInfoContainer title="Пользователи">
      <img className="mt-2 lg:mt-0" src={dubleCheck} alt="check" />

      <div className="flex flex-wrap gap-4">
        <div className="flex justify-between items-end">
          <div className="sm:pr-[54px] md:pr-[2px]">
            <h3 className="text-sm">Общие</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">{users.totalUsers}</p>
              {trendIndicator(users.totalTrend)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Новые</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">{users.newUsers}</p>
              {trendIndicator(users.newTrend)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Повторные</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">{users.repeatedUsers}</p>
              {trendIndicator(users.repeatedTrend)}
            </div>
          </div>
        </div>
      </div>
    </DashboardInfoContainer>
  );
};
