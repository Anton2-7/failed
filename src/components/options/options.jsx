////Нужно полоностью пределать не готово

import React, { useEffect, useState, useContext } from "react";
import "./MultiSelect.css"; // Подключаем CSS для стилизации
import { AccessContext } from "@/providers/AccessProvider";

const OptionsComponent = () => {
  const { getRoles } = useContext(AccessContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dataRoles, setDataRoles] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [roles, setRoles] = useState();
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const getDataRoles = async () => {
      const data = await getRoles();
      setDataRoles(data);
      console.log(dataRoles, "rolesData");

      // Инициализируем состояние чекбоксов для всех ролей
      const initialRoles = { all: false };
      data.forEach((role) => {
        initialRoles[role.id] = false;
      });
      setRoles(initialRoles);
    };

    getDataRoles();
    console.log("roles!!!!!!!!!!!!!!", roles);
  }, []);

  const selectAllCotegories = (checked) => {
    const newRoles = {};
    for (const key in roles) {
      newRoles[key] = checked;
    }
    setRoles(newRoles);
    setSelectedValues(
      checked
        ? dataRoles.map((role) => ({ id: role.id, value: role.name }))
        : []
    );
  };

  const selectCotegories = (id, checked) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [id]: checked,
    }));

    if (checked) {
      const selectedRole = dataRoles.find((role) => role.id === +id);
      setSelectedValues((prevSelectedValues) => [
        ...prevSelectedValues,
        { id, value: selectedRole.name },
      ]);
    } else {
      setSelectedValues((prevSelectedValues) =>
        prevSelectedValues.filter((value) => value.id !== id)
      );
    }
  };

  useEffect(() => {
    console.log("selectedValues", selectedValues);
  }, [selectedValues]);

  const handleCheckboxChange = (event) => {
    const { id, value, checked } = event.target;
    console.log(id, value, checked);

    if (id === "all") {
      selectAllCotegories(checked);
    } else {
      selectCotegories(id, checked);
    }

    // Обновляем selectedValues
    // setSelectedValues(
    //   checked
    //     ? dataRoles.map((role) => ({ id: role.id, value: role.name }))
    //     : []
    // );
  };

  const handleChecAddRole = () => {
    addTag();
  };

  // Обработчик изменения текстового поля
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Добавление нового значения
  const addTag = () => {
    const value = inputValue.trim();
    console.log(selectedValues, "selectedValues!!!!!!!!!!!!!!");
    const newId = Date.now(); // Используем текущее время как ID
    if (value && !selectedValues.some((item) => item.value === value)) {
      setSelectedValues([...selectedValues, { id: newId, value: value }]); // Добавляем новое значение
      setRoles((prevRoles) => ({
        ...prevRoles,
        [newId]: false,
      }));
      setDataRoles((prevDataRoles) => [
        ...prevDataRoles,
        { id: newId, name: value },
      ]);
      setInputValue(""); // Очищаем поле ввода
    }
  };

  // Удаление значения
  const removeTag = (valueToRemove) => {
    // console.log("valueToRemove", valueToRemove);
    // console.log("selectedValues", selectedValues);

    setSelectedValues(
      selectedValues.filter((value) => value.id !== valueToRemove)
    );

    setRoles((prevRoles) => ({
      ...prevRoles,
      [valueToRemove]: false,
    }));

    // Если был удален последний элемент, снимаем выбор с "Все"
    if (selectedValues.length === 1) {
      setRoles((prevRoles) => ({
        ...prevRoles,
        all: false,
      }));
    }
  };

  // Очистка всех значений
  const clearAll = () => {
    setSelectedValues([]);
  };

  return (
    <>
      <label
        style={{
          top: "22px",
          left: "10px",
          background: "#fcfcfc",
          color: "#99A1B7",
          fontSize: "11px",
          width: "fit-content",
        }}
        className="relative z-10 text-sm font-medium text-gray-900"
      >
        Роль (выберите или введите самостоятельно)
      </label>
      <div className="multi-select-container">
        <div
          className={`selected-values ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            Выбрано <span id="selected-count">{selectedValues.length}</span>
          </span>

          {/* <button
            className="clear-button"
            onClick={clearAll}
            title="Очистить все"
          >
            <i className="fas fa-times"></i>
          </button> */}
        </div>
        {!isOpen ? (
          <div className="tags-container">
            {selectedValues.map((item, index) => (
              <div key={index} className="tag">
                {item.value}
                <span className="close-btn" onClick={() => removeTag(item.id)}>
                  x
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="selected-user-role">
            <div className="checkbox-style">
              <input
                type="checkbox"
                id="all"
                name="all"
                value={"Все"}
                checked={roles.all}
                onChange={handleCheckboxChange}
              />
              <label className="label-text" htmlFor="all">
                Все
              </label>
            </div>

            {dataRoles.map((role, index) => (
              <div key={index} className="checkbox-style">
                <input
                  type="checkbox"
                  id={role.id}
                  name={role.id}
                  value={role.name}
                  checked={roles[role.id]}
                  onChange={handleCheckboxChange}
                />
                <label className="label-text" htmlFor={role.id}>
                  {role.name}
                </label>
              </div>
            ))}

            <input
              type="text"
              id="role-input"
              placeholder={`Выбрано ${selectedValues.length}`}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && addTag()} // Добавляем значение по нажатию Enter
            />
            <button
              className="btn btn-primary w-full flex justify-center"
              onClick={handleChecAddRole}
            >
              Добавить
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export { OptionsComponent };

//   <input
//   type="text"
//   id="role-input"
//   placeholder={`Выбрано ${selectedValues.length}`}
//   value={inputValue}
//   onChange={handleInputChange}
//   onKeyDown={(e) => e.key === "Enter" && addTag()} // Добавляем значение по нажатию Enter
// /> */}
