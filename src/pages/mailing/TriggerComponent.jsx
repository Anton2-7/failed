import React, { useState } from "react";
import { Select, TimePicker } from "antd";

// Моковые данные для опций
const mockOptions = {
  inactive_days: [
    { label: "1 день", value: 1 },
    { label: "3 дня", value: 3 },
    { label: "5 дней", value: 5 },
    { label: "7 дней", value: 7 },
  ],
  task_ids: [
    { label: "Задание 1", value: 1 },
    { label: "Задание 2", value: 2 },
    { label: "Задание 3", value: 3 },
    { label: "Задание 4", value: 4 },
  ],
  contest_ids: [
    { label: "Конкурс 1", value: 1 },
    { label: "Конкурс 2", value: 2 },
    { label: "Конкурс 3", value: 3 },
    { label: "Конкурс 4", value: 4 },
  ],
  time_remaining: [
    { label: "1 час", value: "1:00:00" },
    { label: "2 часа", value: "2:00:00" },
    { label: "3 часа", value: "3:00:00" },
    { label: "4 часа", value: "4:00:00" },
  ],
};

const TriggerComponent = ({ trigger, onChange }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(trigger.params);

  const handleSelectChange = (key, value) => {
    const updatedParams = { ...selectedValue, [key]: value };
    setSelectedValue(updatedParams);
    onChange(trigger.id, updatedParams); // Передаем обновленные параметры в родительский компонент
    setIsDropdownVisible(false); // Закрываем выпадающий список
  };

  const renderTriggerContent = () => {
    switch (trigger.name) {
      case "Не заходил X дней":
        return (
          <span
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            Не заходил {selectedValue.inactive_days} дней
            {isDropdownVisible && (
              <Select
                value={selectedValue.inactive_days}
                onChange={(value) => handleSelectChange("inactive_days", value)}
                style={{ width: 120, marginLeft: 10 }}
                options={mockOptions.inactive_days}
              />
            )}
          </span>
        );
      case "Не выполнил задание":
        return (
          <span
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            Не выполнил задание {selectedValue.task_id}
            {isDropdownVisible && (
              <Select
                value={selectedValue.task_id}
                onChange={(value) => handleSelectChange("task_id", value)}
                style={{ width: 120, marginLeft: 10 }}
                options={mockOptions.task_ids}
              />
            )}
          </span>
        );
      case "До конца конкурса осталось времени":
        return (
          <>
            <span
              onClick={() => setIsDropdownVisible(!isDropdownVisible)}
              style={{ cursor: "pointer", color: "#1890ff" }}
            >
              До конца конкурса {selectedValue.contest_id} осталось времени{" "}
              {selectedValue.time_remaining}
            </span>
            {isDropdownVisible && (
              <>
                <Select
                  value={selectedValue.contest_id}
                  onChange={(value) => handleSelectChange("contest_id", value)}
                  style={{ width: 120, marginLeft: 10 }}
                  options={mockOptions.contest_ids}
                />
                <Select
                  value={selectedValue.time_remaining}
                  onChange={(value) =>
                    handleSelectChange("time_remaining", value)
                  }
                  style={{ width: 120, marginLeft: 10 }}
                  options={mockOptions.time_remaining.map((item) => ({
                    label: item.label,
                    value: item.value,
                  }))}
                />
              </>
            )}
          </>
        );
      case "Не участвовал в конкурсе":
        return (
          <span
            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            Не участвовал в конкурсе {selectedValue.contest_id}
            {isDropdownVisible && (
              <Select
                value={selectedValue.contest_id}
                onChange={(value) => handleSelectChange("contest_id", value)}
                style={{ width: 120, marginLeft: 10 }}
                options={mockOptions.contest_ids}
              />
            )}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="trigger-item">
      <div className="trigger-name">{trigger.name}</div>
      <div className="trigger-description">{renderTriggerContent()}</div>
    </div>
  );
};

export default TriggerComponent;
