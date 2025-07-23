// // components/MobileDateTimeRangePicker.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { DateRange } from "react-date-range";
// import dayjs from "dayjs";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// export const MobileDateTimeRangePicker = ({ value, onChange }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   const [range, setRange] = useState([
//     {
//       startDate: value?.[0]?.toDate() || new Date(),
//       endDate: value?.[1]?.toDate() || new Date(),
//       key: "selection",
//     },
//   ]);
//   const [startTime, setStartTime] = useState("00:00");
//   const [endTime, setEndTime] = useState("23:59");

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const applyRange = () => {
//     const start = dayjs(range[0].startDate)
//       .hour(+startTime.split(":")[0])
//       .minute(+startTime.split(":")[1]);
//     const end = dayjs(range[0].endDate)
//       .hour(+endTime.split(":")[0])
//       .minute(+endTime.split(":")[1]);
//     onChange?.([start, end]);
//     setOpen(false);
//   };

//   return (
//     <div className="relative w-full" ref={ref}>
//       <input
//         readOnly
//         className="input w-full px-2 py-2 border border-gray-300 rounded-md cursor-pointer"
//         value={`${dayjs(range[0].startDate).format("DD.MM.YYYY")} ${startTime} - ${dayjs(range[0].endDate).format("DD.MM.YYYY")} ${endTime}`}
//         onClick={() => setOpen(!open)}
//       />

//       {open && (
//         <div className="absolute z-50 bg-white p-2 rounded shadow-md mt-2">
//           <DateRange
//             editableDateInputs={true}
//             onChange={(item) => setRange([item.selection])}
//             moveRangeOnFirstSelection={false}
//             ranges={range}
//             showDateDisplay={false}
//             showMonthAndYearPickers={true}
//           />
//           <div className="flex flex-col gap-2 mt-2">
//             <label className="text-xs text-gray-600">Время начала</label>
//             <input
//               type="time"
//               value={startTime}
//               onChange={(e) => setStartTime(e.target.value)}
//               className="border rounded p-1 w-full"
//             />
//             <label className="text-xs text-gray-600">Время окончания</label>
//             <input
//               type="time"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               className="border rounded p-1 w-full"
//             />
//             <button
//               className="mt-2 bg-blue-500 text-white rounded px-4 py-1"
//               onClick={applyRange}
//             >
//               Применить
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
