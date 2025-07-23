import { DashboardRegistr } from "./DashboardRegistr";
import { DashboardTasks } from "./DashboardTasks";
import { DashboardTicket } from "./DashboardTicket";
import { DashboardUsers } from "./DashboardUsers";
import { useState } from "react";
import { Select } from "antd";
const { Option } = Select;

export const InfoHub = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center pb-[33px] pl-[32px] pr-[32px]">
        {/* <h1 className="text-2xl lg:text-3xl font-bold leading-none text-gray-900">
          Дашборд
        </h1>
        <div>
          <Select
            className="input ps-0 pe-0 border-none"
            value={selectedPeriod}
            onChange={handlePeriodChange}
          >
            <Option value={"today"}>Сегодня</Option>
            <Option value={"yesterday"}>Вчера</Option>
          </Select>
        </div> */}
      </div>
      <div className="">
        <div className="">
          <div className="flex gap-8">
            <DashboardUsers period={selectedPeriod} />
            <DashboardRegistr period={selectedPeriod} />
          </div>
          <div className="flex gap-8">
            <DashboardTasks period={selectedPeriod} />
            <DashboardTicket period={selectedPeriod} />
          </div>
        </div>
      </div>
    </div>
  );
};
