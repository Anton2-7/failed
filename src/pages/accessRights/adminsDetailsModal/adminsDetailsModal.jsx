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
import axios from "axios";
import { AccessContext } from "@/providers/AccessProvider";
import { BASE_URL } from "../../../static";
import { ModalInputPassword } from "../../../components/modalInput/modalInputPassword";

// Задорожний Вячеслав Евгеньевич
const ModalAdminsDetails = () => {
  const { getRoles, rolesProvider, patchAdmin } = useContext(AccessContext);
  const { refreshTrigger } = useContext(ModalContext);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const {
    isModalOpen,
    selectedRowData,
    closeModal,
    setModals,
    updateDataModal,
  } = useContext(ModalContext);
  const [value, setValue] = useState({
    phone: selectedRowData?.phone_number || "",
    email: selectedRowData?.email || "",
    roles: [...rolesProvider],
    fio: "",
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (key, value) => {
    setPasswordData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("error", "Пароли не совпадают");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showAlert("error", "Пароль должен содержать минимум 6 символов");
      return;
    }

    try {
      const objBody = {
        first_name: value.fio.split(" ")[0],
        last_name: value.fio.split(" ")[2],
        middle_name: value.fio.split(" ")[1],
        email: value.email,
        phone_number: value.phone,
        password: passwordData.newPassword,
        role_ids: selectedRoleIds, //rolesProvider.map(role => role.id)
        status: "active",
        // password: passwordData.newPassword
      };
      console.log("Sending password update:", objBody);

      await axios.patch(
        `${BASE_URL}/admins/admin/${selectedRowData.id}`,
        objBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      showAlert("success", "Пароль успешно изменен");
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      showAlert(
        "error",
        error.response?.data?.message || "Ошибка при изменении пароля"
      );
      console.error("Password update error:", error);
    }
  };

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
    if (selectedRowData?.roles) {
      setSelectedRoleIds(selectedRowData.roles.map((role) => role.id));
    }
  }, [selectedRowData]);

  useEffect(() => {
    console.log(
      "selectedRowData44444444444444444444444444444",
      selectedRowData
    );

    if (selectedRowData) {
      const fullName =
        selectedRowData.first_name +
        " " +
        selectedRowData.middle_name +
        " " +
        selectedRowData.last_name;

      setValue({
        email: selectedRowData.email || "",
        roles: [...rolesProvider] || [],
        fio: fullName || "",
        phone: selectedRowData.phone_number || "",
      });
    }
  }, [selectedRowData]);

  const userDataPatchSave = async (objBody, textMsg) => {
    try {
      await axios.patch(`${BASE_URL}/users/${selectedRowData.id}/`, objBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showAlert("success", textMsg);
      updateDataModal(selectedRowData.id);
    } catch (error) {
      showAlert("error", error);
      console.error("Error fetching giveaways:", error);
    }
  };

  useEffect(() => {}, []);
  const handleInputChange = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeRoles = () => {
    closeModal("adminDetails");
    setModals((prev) => ({
      ...prev,
      editRole: true,
    }));
  };

  const hanleModalForm = () => {
    console.log("rolesProvider FORM", rolesProvider);
    const objBody = {
      first_name: value.fio.trim(), // всё ФИО сюда
      last_name: "", // пусто
      middle_name: "",
      email: value.email,
      phone_number: value.phone,
      // password: "123456789",
      role_ids: selectedRoleIds, //rolesProvider.map(role => role.id)
      status: "active",
    };

    console.log("objBody", objBody);
    patchAdmin(objBody, selectedRowData.id);
    refreshTrigger();
    // addNewAdmin(objBody);
  };

  return (
    <>
      <Modal
        className="modal-center h-full w-full"
        open={isModalOpen}
        onClose={() => closeModal("adminDetails")}
      >
        <ModalContent className="max-w-[670px] min-h-[300px] top-[15%]">
          <div
            style={{ padding: "10px 15px 19px 28px" }}
            className="flex justify-between items-center"
          >
            <div
              style={{ position: "relative", top: "20px", color: "#071437" }}
              className="fz-16 font-semibold"
            >
              Обновить данные
            </div>
          </div>
          <div
            style={{ position: "relative", top: "12px" }}
            className="flex justify-center"
          >
            <hr style={{ width: "570px", border: "1px solid #F1F1F4" }}></hr>
          </div>

          <ModalBody
            style={{ padding: "33px" }}
            className="grid px-0 py-5 gap-2"
          >
            <div className="flex flex-col gap-4">
              <ModalInput
                text={"ФИО"}
                typeInput={"text"}
                value={value.fio || ""}
                onChange={(value) => handleInputChange("fio", value)}
              />
              <MultiSelect
                text={"Роль (выберите или введите самостоятельно)"}
                selectionItems={getRoles}
                rolesList={selectedRowData}
                onChange={(roleIds) => setSelectedRoleIds(roleIds)}
                // onChange={(value) => handleInputChange("roles", value)}
              />
            </div>

            <div className="flex flex-col justify-between align-center">
              <div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <ModalInput
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
                    value={value.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="fz-14 font-normal my-4 text-[#252F4A]">
                    Изменить пароль
                  </span>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <ModalInputPassword
                      sz={"95%"}
                      text={"Новый пароль"}
                      typeInput={"password"}
                      value={passwordData.newPassword}
                      onChange={(value) =>
                        handlePasswordChange("newPassword", value)
                      }
                    />
                    <ModalInputPassword
                      sz={"95%"}
                      text={"Повторите новый пароль"}
                      typeInput={"password"}
                      value={passwordData.confirmPassword}
                      onChange={(value) =>
                        handlePasswordChange("confirmPassword", value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-2 pt-5">
                <div className="w-full flex gap-2 w-2/3">
                  <button
                    class="btn btn-outline btn-success flex justify-center w-full"
                    onClick={handleChangeRoles}
                  >
                    Редактировать роли
                  </button>
                  <button
                    class="btn btn-outline btn-primary flex justify-center w-full"
                    onClick={handlePasswordUpdate}
                  >
                    Сменить пароль
                  </button>
                </div>
                <div className="w-full flex gap-2 lg:w-1/3">
                  <button
                    class="btn btn-outline btn-primary flex justify-center w-full"
                    onClick={() => closeModal("adminDetails")}
                  >
                    Отменить
                  </button>
                  <button
                    class="btn btn-primary flex justify-center w-full"
                    onClick={hanleModalForm}
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export { ModalAdminsDetails };
