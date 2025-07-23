import arrowUp from "../../../assets/icons/dashboardinfo/arrow-up.svg";
import arrowDown from "../../../assets/icons/dashboardinfo/arrow-down.svg";
import { useEffect, useState } from "react";
import { DashboardInfoContainer } from "./dashboardinfo/DashboardInfoСontainer";
import invoice from "../../../assets/icons/dashboardinfo/invoice.svg";
import axios from "axios";
import { BASE_URL } from "../../../static";

export const DashboardTicket = ({ period }) => {
  const [data, setData] = useState({
    tickets: {
      received: {
        value: 0,
        trend: {
          trend_value: "0%",
          trend_direction: true,
        },
      },
      spent: {
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
    <DashboardInfoContainer title="Билеты">
      <img className="mt-2 lg:mt-0" src={invoice} alt="invoice" />

      <div className="flex flex-wrap gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Получено</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.tickets.received.value}
              </p>
              {trendIndicator(data.tickets.received.trend)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm">Потрачено</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">
                {data.tickets.spent.value}
              </p>
              {trendIndicator(data.tickets.spent.trend)}
            </div>
          </div>
        </div>

        <div className="opacity-50 flex justify-between items-end">
          <div>
            <h3 className="text-sm">Куплено</h3>
            <div className="flex gap-[8px] items-center">
              <p className="text-[18px] font-semibold">1265</p>
              <div
                className={`flex gap-[3px] p-[7px] bg-[#EAFFF1] rounded-sm items-center`}
              >
                <img className="w-[10px]" src={arrowUp} alt="arrow" />
                <span className={`text-[#17C653] text-xs font-semibold`}>
                  0.0%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardInfoContainer>
  );
};
