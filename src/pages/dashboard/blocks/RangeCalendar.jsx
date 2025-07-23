// // Updated: добавлены выпадающие списки для выбора часов и минут, оформление в стиле макета
// import React, { useState } from "react";
// import { useRangeCalendarState } from "@react-stately/calendar";
// import { useRangeCalendar } from "@react-aria/calendar";
// import { useLocale, useDateFormatter } from "@react-aria/i18n";
// import {
//   createCalendar,
//   fromDate,
//   CalendarDate,
// } from "@internationalized/date";

// function RangeCalendar({ value, onChange, onClose }) {
//   const { locale } = useLocale();
//   const timeZone = "UTC";

//   const start = value?.[0] ? fromDate(new Date(value[0]), timeZone) : null;
//   const end = value?.[1] ? fromDate(new Date(value[1]), timeZone) : null;

//   const [startHour, setStartHour] = useState("08");
//   const [startMinute, setStartMinute] = useState("00");
//   const [endHour, setEndHour] = useState("18");
//   const [endMinute, setEndMinute] = useState("00");

//   const state = useRangeCalendarState({
//     locale,
//     visibleDuration: { months: 2 },
//     value: { start, end },
//     onChange: ({ start, end }) => {
//       const withTime = (date, hour, minute) => {
//         const d =
//           typeof date.toDate === "function" ? date.toDate() : new Date(date);
//         d.setHours(Number(hour));
//         d.setMinutes(Number(minute));
//         return d;
//       };
//       onChange([
//         start ? withTime(start, startHour, startMinute) : null,
//         end ? withTime(end, endHour, endMinute) : null,
//       ]);
//     },
//     createCalendar,
//   });

//   const ref = React.useRef();
//   const { calendarProps, prevButtonProps, nextButtonProps, title } =
//     useRangeCalendar({}, state, ref);

//   const formatter = useDateFormatter({ dateStyle: "long", timeStyle: "short" });

//   const timeSelect = (value, setter, label) => (
//     <select
//       className="text-gray-800 text-sm text-center w-full bg-transparent focus:outline-none"
//       value={value}
//       onChange={(e) => setter(e.target.value)}
//     >
//       {Array.from({ length: label === "часы" ? 24 : 60 }, (_, i) => {
//         const val = i.toString().padStart(2, "0");
//         return (
//           <option key={val} value={val}>
//             {val}
//           </option>
//         );
//       })}
//     </select>
//   );

//   function formatMonthTitle(date) {
//     const [month, year] = date
//       .toDate()
//       .toLocaleString("ru-RU", { month: "long", year: "numeric" })
//       .replace(" г.", "")
//       .split(" ");

//     return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
//   }

//   return (
//     <div
//       className="bg-white rounded-xl shadow-md p-4 w-[700px]"
//       {...calendarProps}
//       ref={ref}
//     >
//       <div className="flex justify-between items-center mb-4">
//         <button
//           {...prevButtonProps}
//           className="w-8 h-8 flex justify-center items-center bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
//         >
//           ←
//         </button>

//         <div className="flex justify-between flex-1 text-center text-base font-medium text-[#0a1f44]">
//           <div className="w-1/2">
//             {formatMonthTitle(state.visibleRange.start)}
//           </div>
//           <div className="w-1/2">
//             {formatMonthTitle(state.visibleRange.start.add({ months: 1 }))}
//           </div>
//         </div>

//         <button
//           {...nextButtonProps}
//           className="w-8 h-8 flex justify-center items-center bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
//         >
//           →
//         </button>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <MonthView state={state} date={state.visibleRange.start} />
//         <MonthView
//           state={state}
//           date={state.visibleRange.start.add({ months: 1 })}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4 mt-2">
//         <div className="flex justify-center items-center gap-2">
//           {timeSelect(startHour, setStartHour, "часы")}
//           <span>:</span>
//           {timeSelect(startMinute, setStartMinute, "минуты")}
//         </div>
//         <div className="flex justify-center items-center gap-2">
//           {timeSelect(endHour, setEndHour, "часы")}
//           <span>:</span>
//           {timeSelect(endMinute, setEndMinute, "минуты")}
//         </div>
//       </div>
//       <div className="mt-6 mb-3 border-t border-gray-400" />
//       <div className="flex items-center justify-end mt-4 gap-4">
//         <div className="text-center text-sm text-gray-700">
//           {value?.[0] && value?.[1] ? (
//             <div>
//               {formatter.format(value[0])} — {formatter.format(value[1])}
//             </div>
//           ) : (
//             <div>Выберите диапазон</div>
//           )}
//         </div>

//         <div className="flex gap-2 text-sm">
//           <button
//             className="btn btn-outline btn-primary"
//             onClick={() => onChange([null, null])}
//           >
//             Отмена
//           </button>
//           <button
//             className="btn btn-primary"
//             onClick={() => {
//               const withTime = (date, hour, minute) => {
//                 const d =
//                   typeof date.toDate === "function"
//                     ? date.toDate()
//                     : new Date(date);
//                 d.setHours(Number(hour));
//                 d.setMinutes(Number(minute));
//                 return d;
//               };
//               onChange([
//                 state.value?.start
//                   ? withTime(state.value.start, startHour, startMinute)
//                   : null,
//                 state.value?.end
//                   ? withTime(state.value.end, endHour, endMinute)
//                   : null,
//               ]);
//             }}
//           >
//             Применить
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MonthView({ state, date }) {
//   const startOfMonth = new CalendarDate(date.year, date.month, 1);
//   const daysInMonth = startOfMonth.calendar.getDaysInMonth(startOfMonth);
//   const endOfMonth = startOfMonth.add({ days: daysInMonth - 1 });

//   const days = [];
//   let current = startOfMonth;
//   while (current.compare(endOfMonth) <= 0) {
//     days.push(current);
//     current = current.add({ days: 1 });
//   }

//   const jsWeekday = startOfMonth.toDate().getDay();
//   const offset = (jsWeekday + 6) % 7;

//   return (
//     <div>
//       {/* <div className="text-center font-medium text-lg mb-2">
//         {date
//           .toDate()
//           .toLocaleString("ru-RU", { month: "long", year: "numeric" })}
//       </div> */}
//       <div className="grid grid-cols-7 text-center text-xs text-gray-500">
//         {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
//           <div key={d}>{d}</div>
//         ))}
//       </div>
//       <div className="grid grid-cols-7 text-center gap-y-1 mt-1">
//         {Array.from({ length: offset }).map((_, i) => (
//           <div key={`empty-${i}`} />
//         ))}
//         {days.map((day) => {
//           const range =
//             state.getHighlightRange?.() ??
//             (state.value?.start && state.value?.end
//               ? { start: state.value.start, end: state.value.end }
//               : null);

//           const isInRange =
//             range &&
//             day.compare(range.start) >= 0 &&
//             day.compare(range.end) <= 0;
//           const isStart = range && day.compare(range.start) === 0;
//           const isEnd = range && day.compare(range.end) === 0;
//           const isMiddle = isInRange && !isStart && !isEnd;

//           const base =
//             "py-1 text-sm cursor-pointer text-center transition-colors duration-150 select-none";

//           const rounded =
//             isStart && isEnd
//               ? "rounded-md"
//               : isStart
//                 ? "rounded-l-md"
//                 : isEnd
//                   ? "rounded-r-md"
//                   : "";

//           const bg =
//             isStart || isEnd
//               ? "bg-[#1B84FF] text-white"
//               : isMiddle
//                 ? "bg-[#EFF6FF] text-blue-900"
//                 : "hover:bg-gray-100";

//           return (
//             <div
//               key={day.toString()}
//               className={`${base} ${rounded} ${bg}`}
//               onClick={() => state.selectDate(day)}
//             >
//               {day.day}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default RangeCalendar;
