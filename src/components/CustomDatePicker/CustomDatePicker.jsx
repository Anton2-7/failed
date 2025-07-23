import React, { useRef, useEffect, useState } from "react";
import flatpickr from "flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru";
import "flatpickr/dist/flatpickr.min.css";
import "./datepicker.css";

export default function CustomDatePicker({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [selectedRange, setSelectedRange] = useState([]);

  useEffect(() => {
    const fp = flatpickr(inputRef.current, {
      mode: "range",
      showMonths: 2,
      enableTime: true,
      time_24hr: true,
      dateFormat: "d.m.Y, H:i",
      defaultDate: value.length === 2 ? value : undefined,
      locale: Russian,
      onOpen: () => {
        setTimeout(() => {
          const calendar = document.querySelector(".flatpickr-calendar");
          if (!calendar) return;

          // ==== Calendar styling ====
          calendar.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
          calendar.style.borderRadius = "16px";
          calendar.style.border = "1px solid #E2E8F0";
          calendar.style.fontFamily = "inherit";
          calendar.style.paddingBottom = "0";

          // ==== Clean up old footers ====
          const oldFooters = calendar.querySelectorAll(".custom-footer");
          oldFooters.forEach((el) => el.remove());

          // ==== Clone timepickers side-by-side ====
          const timeOriginal = calendar.querySelector(
            ".flatpickr-time:not(.clone)"
          );
          const existingClone = calendar.querySelector(".flatpickr-time.clone");
          if (timeOriginal && !existingClone) {
            const clone = timeOriginal.cloneNode(true);
            clone.classList.add("clone");

            const wrapper = document.createElement("div");
            wrapper.style.display = "flex";
            wrapper.style.justifyContent = "space-between";
            wrapper.style.width = "100%";
            wrapper.style.paddingTop = "12px";

            timeOriginal.style.width = "50%";
            clone.style.width = "50%";

            wrapper.appendChild(timeOriginal);
            wrapper.appendChild(clone);
            calendar.appendChild(wrapper);
          }

          // ==== Preview selected date range ====
          const range = fp.selectedDates;
          const preview = document.createElement("div");
          preview.className = "custom-footer";
          preview.style.padding = "12px 16px 0 16px";
          preview.style.textAlign = "center";
          preview.style.fontSize = "14px";
          preview.style.color = "#1E293B";
          preview.textContent =
            range.length === 2
              ? `${formatDate(range[0])} — ${formatDate(range[1])}`
              : "";

          // ==== Buttons ====
          const footer = document.createElement("div");
          footer.className = "custom-footer";
          footer.style.display = "flex";
          footer.style.justifyContent = "flex-end";
          footer.style.gap = "10px";
          footer.style.padding = "12px 16px";
          footer.style.borderTop = "1px solid #e5e7eb";
          //   footer.style.marginTop = "8px";

          const cancelBtn = document.createElement("button");
          cancelBtn.textContent = "Отмена";
          Object.assign(cancelBtn.style, {
            background: "#EFF6FF",
            color: "#3B82F6",
            border: "1px solid #c5dfff",
            padding: "6px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          });
          cancelBtn.onclick = () => {
            fp.clear();
            fp.close();
          };

          const applyBtn = document.createElement("button");
          applyBtn.textContent = "Применить";
          Object.assign(applyBtn.style, {
            background: "#3B82F6",
            color: "#fff",
            border: "none",
            padding: "6px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          });
          applyBtn.onclick = () => {
            fp.close();
          };

          footer.appendChild(cancelBtn);
          footer.appendChild(applyBtn);

          calendar.appendChild(preview);
          calendar.appendChild(footer);
        }, 0);
      },
      onChange: (dates) => {
        setSelectedRange(dates);
        if (dates.length === 2) {
          onChange(dates);
        }
      },
    });

    return () => fp.destroy();
  }, []);

  return (
    <input
      ref={inputRef}
      placeholder="Выберите диапазон"
      style={{
        width: "100%",
        height: "40px",
        padding: "0 12px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        outline: "none",
      }}
    />
  );
}

function formatDate(date) {
  const pad = (n) => (n < 10 ? `0${n}` : n);
  const d = new Date(date);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
