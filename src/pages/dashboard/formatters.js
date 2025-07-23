import dayjs from "../dashboard/dayjsConfig";

export const formatCategory = (dateStr, grouping) => {
  if (!dateStr) return "Invalid Date";

  if (grouping === "week") {
    const start = new Date(dateStr);
    if (isNaN(start)) return "Invalid Date";

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const startDay = start.getDate();
    const startMonth = start.toLocaleString("ru-RU", { month: "long" });

    const endDay = end.getDate();
    const endMonth = end.toLocaleString("ru-RU", { month: "long" });

    const showEndMonth = endMonth !== startMonth;

    return `${startDay} ${startMonth} – ${endDay}${showEndMonth ? " " + endMonth : ""}`;
  }

  if (grouping === "month") {
    const date = new Date(dateStr);
    return date.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  }

  // по дням
  const date = new Date(dateStr);
  return `${date.getDate()} ${date.toLocaleString("ru-RU", { month: "short" })}`;
};
