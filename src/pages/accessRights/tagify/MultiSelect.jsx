import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import "./MultiSelect.css"; // Подключаем CSS для стилизации
import { AccessContext } from "@/providers/AccessProvider";
import { ModalContext } from "@/providers/ModalProvider";

const MultiSelect = ({
  text,
  selectionItems,
  rolesList,
  onChange,
  isInvalid,
}) => {
  const { permissions, setPermissions, setRolesProvider } =
    useContext(AccessContext);
  const { isModalOpen1, closeModal1, setModals } = useContext(ModalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dataRoles, setDataRoles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [typeData, setTypeData] = useState([]);

  const [roles, setRoles] = useState({ all: false });
  const [selectedValues, setSelectedValues] = useState([]);

  const getDataRoles = async () => {
    const data = await selectionItems();
    setDataRoles(data.data);
    setTypeData(data.type);
  };

  useEffect(() => {
    if (selectionItems) {
      getDataRoles();
    }
  }, []);

  useEffect(() => {
    if (rolesList && dataRoles.length > 0) {
      const initialSelectedIds = rolesList.roles?.map((role) => role.id) || [];

      // Инициализируем чекбоксы
      const initialRoles = {};
      dataRoles.forEach((item) => {
        initialRoles[item.id] = initialSelectedIds.includes(item.id);
      });

      // Инициализируем selectedValues
      const initialSelected = dataRoles
        .filter((item) => initialSelectedIds.includes(item.id))
        .map((item) => ({ id: item.id, value: item.name }));

      setRoles(initialRoles);
      setSelectedValues(initialSelected);

      // Инициализируем rolesProvider
      if (typeData === "roles") {
        setRolesProvider(initialSelectedIds);
      }
    }
  }, [rolesList, dataRoles, typeData]);

  const initializeRoles = () => {
    if (dataRoles && dataRoles.length > 0) {
      const initialRoles = {};
      const initialSelected = [];
      dataRoles.forEach((role) => {
        const isChecked = permissions?.includes(role.id);
        console.log(isChecked);
        initialRoles[role.id] = isChecked;
        if (isChecked) {
          initialSelected.push({ id: role.id, value: role.name });
        }
      });
      setRoles(initialRoles);
      setSelectedValues(initialSelected);
    }
  };

  useEffect(() => {
    console.log("typeData11111111111111111", typeData);
    typeData === "permissions" && initializeRoles();
  }, [typeData, permissions]);

  const selectAllCotegories = (checked) => {
    const newRoles = {};
    dataRoles.forEach((role) => {
      newRoles[role.id] = checked;
    });

    setRoles(newRoles);

    setSelectedValues(
      checked
        ? dataRoles.map((role) => ({ id: role.id, value: role.name }))
        : []
    );

    if (typeData === "roles") {
      setRolesProvider(checked ? dataRoles.map((role) => role.id) : []);
      onChange(checked ? dataRoles.map((role) => role.id) : []);
    }

    if (typeData === "permissions") {
      setPermissions(checked ? dataRoles.map((role) => role.id) : []);
    }
  };
  const selectCotegories = (id, checked) => {
    const selectedRole = dataRoles.find((role) => role.id === +id);
    if (!selectedRole) return;

    if (checked) {
      // снимаем выбор со всех других ролей
      const newRoles = {};
      dataRoles.forEach((role) => {
        newRoles[role.id] = role.id === +id;
      });
      setRoles(newRoles);
      setSelectedValues([{ id, value: selectedRole.name }]);

      if (typeData === "roles") {
        setRolesProvider([+id]);
        onChange([+id]);
      }
    } else {
      // убираем выбор этой роли
      setRoles((prevRoles) => ({
        ...prevRoles,
        [id]: false,
      }));
      setSelectedValues([]);
      if (typeData === "roles") {
        setRolesProvider([]);
        onChange([]);
      }
    }

    // Обновляем состояние чекбоксов
    setRoles((prevRoles) => ({
      ...prevRoles,
      [id]: checked,
    }));

    // Обновляем selectedValues
    // setSelectedValues((prev) =>
    //   checked
    //     ? [...prev, { id, value: selectedRole.name }]
    //     : prev.filter((item) => item.id !== id)
    // );

    setSelectedValues((prev) =>
      checked
        ? [{ id, value: selectedRole.name }] // оставляем только один
        : prev.filter((item) => item.id !== id)
    );

    if (typeData === "roles") {
      setRolesProvider((prev) => {
        const newRoles = checked
          ? [...prev, +id]
          : prev.filter((roleId) => roleId !== +id);

        // Передаем обновленные роли в родительский компонент
        onChange(newRoles);
        return newRoles;
      });
    }

    if (typeData === "permissions") {
      setPermissions((prev) =>
        checked
          ? [...prev, selectedRole.id]
          : prev.filter((permId) => permId !== selectedRole.id)
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
  };

  const handleChecAddRole = () => {
    closeModal1("addUser");
    setModals((prev) => ({
      ...prev,
      editRole: true,
    }));
    setIsOpen(false);
    // addTag();
  };

  const handleAddAndClose = () => {
    addTag(); // Вызываем функцию добавления
    setIsOpen(false); // Закрываем селект
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
      // setSelectedValues([...selectedValues, { id: newId, value: value }]); // Добавляем новое значение
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
  const removeTag = (roleIdToRemove) => {
    // 1. Удаляем из selectedValues
    setSelectedValues((prev) =>
      prev.filter((item) => item.id !== roleIdToRemove)
    );

    // 2. Обновляем состояние чекбокса
    setRoles((prevRoles) => ({
      ...prevRoles,
      [roleIdToRemove]: false,
    }));

    // 3. Обновляем rolesProvider (если это роли)
    if (typeData === "roles") {
      setRolesProvider((prev) => {
        const newRoles = prev.filter((id) => id !== roleIdToRemove);
        onChange(newRoles); // Уведомляем родительский компонент
        return newRoles;
      });
    }

    // 4. Обновляем permissions (если это разрешения)
    if (typeData === "permissions") {
      setPermissions((prev) => prev.filter((id) => id !== roleIdToRemove));
    }

    // 5. Если это была последняя роль, снимаем выбор "Все"
    if (selectedValues.length === 1) {
      setRoles((prev) => ({ ...prev, all: false }));
    }
  };

  // Очистка всех значений
  // const clearAll = () => {
  //   setSelectedValues([]);
  // };

  return (
    <div style={{ position: "relative", top: "-6px" }}>
      <label
        style={{
          color: "#99A1B7",
          fontSize: "11px",
          width: "fit-content",
        }}
        className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
      >
        {text}
      </label>
      <div
        className={`multi-select-container border ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-gray-300"}`}
      >
        <div
          className={`selected-values ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* <span className="text">
            Выбрано <span id="selected-count">{selectedValues.length}</span>
          </span> */}
          <span>
            Выбрано{" "}
            <span id="selected-count">
              {Object.values(roles).filter(Boolean).length}
            </span>
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
            <div
              style={{ marginTop: "0px", height: "200px", overflow: "auto" }}
              className="selected-user-role"
            >
              {/* <div className="checkbox-style">
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
              </div> */}

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
            </div>
            {typeData === "roles" && (
              <div className="flex flex-col gap-[16px]">
                {/* <input
                  type="text"
                  id="role-input"
                  placeholder={`Выбрано ${selectedValues.length}`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                /> */}
                <button
                  className="btn btn-primary w-full flex justify-center"
                  onClick={handleAddAndClose}
                >
                  Добавить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { MultiSelect };

//   <input
//   type="text"
//   id="role-input"
//   placeholder={`Выбрано ${selectedValues.length}`}
//   value={inputValue}
//   onChange={handleInputChange}
//   onKeyDown={(e) => e.key === "Enter" && addTag()} // Добавляем значение по нажатию Enter
// /> */}
