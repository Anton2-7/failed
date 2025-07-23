// import { useState } from "react";
// import { format, parse } from "date-fns";
// import CustomRangeCalendar from "./CustomRangeCalendar";
// import { Popover } from "antd";

// export default function CalendarField() {
//   const [dateRange, setDateRange] = useState([]);
//   const [from, setFrom] = useState(null);
//   const [to, setTo] = useState(null);
//   const [fromTime, setFromTime] = useState("00:00");
//   const [toTime, setToTime] = useState("00:00");
//   const [open, setOpen] = useState(false);

//   const applyRange = (range, timeFrom, timeTo) => {
//     setFrom(range.from);
//     setTo(range.to);
//     setFromTime(timeFrom);
//     setToTime(timeTo);
//     setOpen(false);

//     // Приводим к moment-подобному формату, если надо
//     const start =
//       range.from &&
//       parse(
//         `${format(range.from, "yyyy-MM-dd")} ${timeFrom}`,
//         "yyyy-MM-dd HH:mm",
//         new Date()
//       );
//     const end =
//       range.to &&
//       parse(
//         `${format(range.to, "yyyy-MM-dd")} ${timeTo}`,
//         "yyyy-MM-dd HH:mm",
//         new Date()
//       );
//     setDateRange([start, end]);
//   };

//   return (
//     <Popover
//       open={open}
//       onOpenChange={setOpen}
//       trigger="click"
//       content={
//         <CustomRangeCalendar
//           onApply={applyRange}
//           initialRange={{ from, to }}
//           initialFromTime={fromTime}
//           initialToTime={toTime}
//         />
//       }
//     >
//       <div
//         className="h-10 w-full border px-3 py-2 rounded cursor-pointer text-sm flex items-center"
//         onClick={() => setOpen(true)}
//       >
//         {from && to
//           ? `${format(from, "yyyy-MM-dd")} ${fromTime} — ${format(to, "yyyy-MM-dd")} ${toTime}`
//           : "Выберите дату"}
//       </div>
//     </Popover>
//   );
// }
