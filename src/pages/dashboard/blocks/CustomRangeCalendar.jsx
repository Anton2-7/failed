// import { useState } from "react";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";

// function TimePicker({ label, value, onChange }) {
//   const hours = Array.from({ length: 24 }, (_, i) =>
//     String(i).padStart(2, "0")
//   );
//   const minutes = Array.from({ length: 60 }, (_, i) =>
//     String(i).padStart(2, "0")
//   );
//   const [hour, minute] = value.split(":");

//   const handleHourChange = (e) => {
//     onChange(`${e.target.value}:${minute}`);
//   };

//   const handleMinuteChange = (e) => {
//     onChange(`${hour}:${e.target.value}`);
//   };

//   return (
//     <div className="flex items-center gap-1">
//       <select
//         value={hour}
//         onChange={handleHourChange}
//         className="border rounded px-2 py-1 text-sm"
//       >
//         {hours.map((h) => (
//           <option key={h} value={h}>
//             {h}
//           </option>
//         ))}
//       </select>
//       <span>:</span>
//       <select
//         value={minute}
//         onChange={handleMinuteChange}
//         className="border rounded px-2 py-1 text-sm"
//       >
//         {minutes.map((m) => (
//           <option key={m} value={m}>
//             {m}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default function CustomRangeCalendar({
//   onApply,
//   initialRange,
//   initialFromTime,
//   initialToTime,
// }) {
//   const [range, setRange] = useState(
//     initialRange || { from: undefined, to: undefined }
//   );
//   const [fromTime, setFromTime] = useState(initialFromTime || "00:00");
//   const [toTime, setToTime] = useState(initialToTime || "00:00");

//   const applySelection = () => {
//     onApply(range, fromTime, toTime);
//   };

//   return (
//     <div className="rounded-xl bg-white shadow-lg p-4 text-sm">
//       <div className="flex gap-4">
//         {/* Месяц слева */}
//         <div>
//           <DayPicker
//             mode="range"
//             selected={range}
//             onSelect={setRange}
//             numberOfMonths={2}
//             fromMonth={new Date(2025, 2)}
//             toMonth={new Date(2026, 3)}
//             styles={{
//               caption: { textAlign: "center" },
//               day: { margin: 0 },
//               head_cell: { textTransform: "none", fontWeight: 500 },
//               cell: { padding: 0, width: "2.5rem", height: "2.5rem" },
//               day_selected: {
//                 backgroundColor: "#3b82f6",
//                 color: "white",
//               },
//               day_range_middle: {
//                 backgroundColor: "#bfdbfe",
//                 color: "black",
//               },
//               day_today: { border: "1px solid #3b82f6" },
//             }}
//           />
//           <div className="flex justify-between px-[80px] mt-2">
//             <div className="">
//               <TimePicker
//                 label="Часы"
//                 value={fromTime}
//                 onChange={setFromTime}
//               />
//             </div>
//             <div className="">
//               <TimePicker label="Часы" value={toTime} onChange={setToTime} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-4 border-t pt-2 text-center flex items-center justify-end gap-4">
//         <div className="pt-2">
//           {range.from &&
//             range.to &&
//             `${format(range.from, "dd.MM.yyyy")}, ${fromTime} — ${format(range.to, "dd.MM.yyyy")}, ${toTime}`}
//         </div>
//         <div className="mt-2 flex justify-center gap-2">
//           <button
//             className="btn btn-outline btn-primary"
//             onClick={() => setRange({})}
//           >
//             Отмена
//           </button>
//           <button className="btn btn-primary" onClick={applySelection}>
//             Применить
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
