import React, { useEffect, useState } from "react";
import axios from "axios";
import VariableThicknessDonut from "./VariableThicknessDonut"; // путь подставь свой

const DonutFromAPI = ({ url, title, fetchUrl }) => {
  const [data, setData] = useState([]);
  //   const data = [
  //     { label: "A", value: 67, color: "#f00" },
  //     { label: "B", value: 33, color: "#0f0" },
  //   ];
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const raw = res.data;

        const parsed = raw.map((item, index) => {
          const value = item?.started?.value ?? item?.users_count?.value ?? 0;
          const trend = item?.started?.trend ?? item?.users_count?.trend;

          return {
            label: item.title || item.name || "—",
            value,
            trend,
            color: colors[index % colors.length],
          };
        });

        setData(parsed);
        console.log(data, "data");
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchData();
  }, [url]);

  return (
    <div>
      <VariableThicknessDonut
        data={data}
        size={156}
        title={title}
        fetchUrl={fetchUrl}
      />
    </div>
  );
};

export default DonutFromAPI;
