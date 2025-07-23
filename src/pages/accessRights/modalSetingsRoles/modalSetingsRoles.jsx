import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from "@/components/modal";
import { KeenIcon } from "@/components";
import { ModalContext } from "@/providers/ModalProvider";
import { ModalInput } from "../../../components/modalInput/modalInput";
import "react-toastify/dist/ReactToastify.css";
import { toast, Bounce } from "react-toastify";

import { MultiSelect } from "../tagify/MultiSelect";
import { AccessContext } from "@/providers/AccessProvider";

const ModalSetingsRoles = () => {
  const {
    getPermissions,
    getRoles,
    addNewRole,
    patchRoles,
    setPermissions,
    permissions,
  } = useContext(AccessContext);
  const { refreshTrigger } = useContext(ModalContext);
  const { isModalOpen, selectedRowData, closeModal } = useContext(ModalContext);
  const [value, setValue] = useState({
    phone: selectedRowData?.phone || "",
    email: selectedRowData?.email || "",
    role: "",
    fio: selectedRowData?.fio || "",
  });
  const [itemsRolses, setItemsRolses] = useState([]);

  const getDataRoles = async () => {
    try {
      const dataRoles = await getRoles();
      setItemsRolses(dataRoles.data);

      // setPermissions([...dataRoles.data.map((role) => role.id)]);
      // Устанавливаем первую роль как активную
      if (dataRoles.data.length > 0) {
        setValue((prev) => ({ ...prev, role: dataRoles.data[0].name }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDataRoles();
  }, []);

  useEffect(() => {
    const activRole = itemsRolses.find((role) => role.name === value.role);
    console.log("activRole2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", value);
    setPermissions(activRole?.permissions.map((role) => role.id));
  }, [value.role]);

  const showAlert = (type, message) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  useEffect(() => {
    if (itemsRolses) {
      setValue({
        role: itemsRolses[0],
      });
    }
  }, [selectedRowData]);

  const handleInputChange = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const handleBanUser = () => {
    const newDeletedValue = !value.deleted;
    setValue((prev) => ({ ...prev, deleted: newDeletedValue }));
  };

  const handleChangePassword = () => {
    if (value.password !== value.passwordCheck) {
      showAlert("error", "Пароли не совпадают");
      return;
    }
  };

  const hanleModalForm = () => {
    const roleId = itemsRolses.find((role) => role.name === value.role).id;
    patchRoles(value.role, roleId);
    refreshTrigger();
    closeModal("editRole");
  };

  const handleAddRole = async () => {
    await addNewRole(value.newRole);
    refreshTrigger();
    await getDataRoles();

    // Очистка поля "Или название новой роли"
    setValue((prev) => ({
      ...prev,
      newRole: "",
    }));
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={() => closeModal("editRole")}>
        <ModalContent className="max-w-[642px] top-[15%]">
          <div
            style={{ padding: "10px 15px 19px 28px" }}
            className="flex justify-between items-center"
          >
            <div
              style={{ position: "relative", top: "20px", color: "#071437" }}
              className="fz-16 font-semibold"
            >
              Настройка ролей
            </div>

            {/* <button
              style={{
                width: "22px",
                height: "22px",
              }}
              className="ki-filled text-[x-large] text-[#99A1B7]"
              onClick={() => closeModal("editRole")}
            >
              <KeenIcon icon="cross-square" />
            </button> */}
          </div>
          <div
            style={{ position: "relative", top: "12px" }}
            className="flex justify-center"
          >
            <hr style={{ width: "570px", border: "1px solid #F1F1F4" }}></hr>
          </div>
          <ModalBody
            style={{ padding: "33px" }}
            className="grid px-0 py-5 gap-[16px]"
          >
            <div
              className="flex flex-col gap-4"
              style={{ position: "relative", top: "-6px" }}
            >
              {/* Селектор для роли переделать компонент */}
              <div style={{ position: "relative", height: "40px" }}>
                <label
                  style={{
                    color: "rgb(153, 161, 183)",
                    fontSize: "11px",
                    width: "fit-content",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Роль
                </label>
                <select
                  className="select w-full"
                  value={value.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  {itemsRolses.map((item, index) => (
                    <option key={index}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-end gap-4">
                <ModalInput
                  text={"Или название новой роли"}
                  typeInput={"text"}
                  value={value.newRole || ""}
                  onChange={(value) => handleInputChange("newRole", value)}
                />
                <button
                  className="btn btn-outline text-[#1B84FF] w-full lg:min-w-[157px] border-[#1B84FF33] bg-aliceblue hover:bg-[#e3eef9] transition-colors duration-300 flex justify-center"
                  onClick={() => handleAddRole()}
                >
                  Добавить еще роль
                </button>
              </div>
              <div className="mt-2">
                <MultiSelect
                  text={"Доступные разделы"}
                  selectionItems={getPermissions}
                />
              </div>
            </div>

            <div className="flex flex-col justify-between align-center">
              {window.screen.width < 500 ? (
                <div className="flex flex-col ">
                  <div
                    style={{
                      position: "relative",
                      top: "-15px",
                      left: "2px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="flex"
                  ></div>
                  <div
                    style={{
                      position: "relative",
                      top: "-20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="flex"
                  ></div>
                </div>
              ) : (
                <div className="flex flex-col ">
                  <div
                    style={{ position: "relative", top: "-15px", left: "2px" }}
                    className="flex gap-2"
                  ></div>
                  <div
                    style={{
                      position: "relative",
                      top: "-20px",
                    }}
                    className="flex gap-2"
                  ></div>
                </div>
              )}

              {window.screen.width > 500 ? (
                <div>
                  <div
                    // style={{ position: "relative", top: "-23px" }}
                    className="flex gap-2"
                  >
                    {/* <ModalInput
                      sz={"95%"}
                      text={"Email"}
                      typeInput={"email"}
                      value={value.email}
                      onChange={(value) => handleInputChange("email", value)}
                    />
                    <ModalInput
                      sz={"95%"}
                      text={"Телефон"}
                      typeInput={"email"}
                      value={value.email}
                      onChange={(value) => handleInputChange("email", value)}
                    /> */}
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    style={{ position: "relative", top: "-23px" }}
                    className="flex flex-col gap-2"
                  ></div>
                </div>
              )}
              <div>
                <button
                  class="btn btn-primary w-full flex justify-center"
                  onClick={hanleModalForm}
                >
                  Сохранить
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export { ModalSetingsRoles };
