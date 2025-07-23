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
import { ModalInputPassword } from "../../../components/modalInput/modalInputPassword";
// Задорожний Вячеслав Евгеньевич
const ModalAddUser = () => {
  const { getRoles, setRolesProvider, rolesProvider, addNewAdmin } =
    useContext(AccessContext);
  const { refreshTrigger } = useContext(ModalContext);
  const {
    isModalOpen,
    selectedRowData,
    closeModal,
    setModals,
    updateDataModal,
  } = useContext(ModalContext);
  const [value, setValue] = useState({
    phone: selectedRowData?.phone || "",
    email: selectedRowData?.email || "",
    roles: [],
    fio: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      // Очистка полей
      setValue({
        phone: "",
        email: "",
        roles: [],
        fio: "",
      });

      // ✅ Сброс ролей
      setRolesProvider([]);
    }
  }, [isModalOpen]);

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (key, value) => {
    setPasswordData((prev) => ({ ...prev, [key]: value }));
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

  // const userDataPatchSave = async (objBody, textMsg) => {
  //   try {
  //     await axios.patch(
  //       `http://185.80.234.165:4018/admin_panel/users/${selectedRowData.id}/`,
  //       objBody,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     showAlert("success", textMsg);
  //     updateDataModal(selectedRowData.id);
  //   } catch (error) {
  //     showAlert("error", error);
  //     console.error("Error fetching giveaways:", error);
  //   }
  // };

  useEffect(() => {}, []);
  const handleInputChange = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeRoles = () => {
    closeModal("addUser");
    setModals((prev) => ({
      ...prev,
      editRole: true,
    }));
  };

  const handleChangeCancel = () => {
    hanleModalForm();
    // closeModal("addUser");
  };

  const [errors, setErrors] = useState({
    fio: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    roles: false,
  });

  const validateForm = () => {
    const newErrors = {
      fio: !value.fio.trim(),
      email: !value.email,
      phone: !value.phone,
      password: passwordData.password.length < 6,
      confirmPassword: passwordData.password !== passwordData.confirmPassword,
      roles: rolesProvider.length === 0,
    };

    setErrors(newErrors);

    if (newErrors.fio) {
      showAlert("error", "Введите ФИО");
      return false;
    }

    if (newErrors.email) {
      showAlert("error", "Введите email");
      return false;
    }

    if (newErrors.phone) {
      showAlert("error", "Введите телефон");
      return false;
    }

    if (newErrors.confirmPassword) {
      showAlert("error", "Пароли не совпадают");
      return false;
    }

    if (newErrors.password) {
      showAlert("error", "Пароль должен содержать минимум 6 символов");
      return false;
    }
    if (newErrors.roles) {
      showAlert("error", "Выберите хотя бы одну роль");
      return false;
    }

    return true;
  };

  const hanleModalForm = async () => {
    if (!validateForm()) return;

    try {
      const objBody = {
        first_name: value.fio.trim(), // всё ФИО сюда
        last_name: "", // пусто
        middle_name: "",
        email: value.email,
        phone_number: value.phone,
        password: passwordData.password,
        role_ids: [...rolesProvider],
        status: "active",
      };

      console.log("Отправка данных:", objBody);
      refreshTrigger();
      await addNewAdmin(objBody);
      closeModal("addUser");
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
      showAlert(
        "error",
        error.response?.data?.message || "Ошибка при добавлении пользователя"
      );
    }
  };

  return (
    <>
      <Modal
        className="modal-center h-full w-full"
        open={isModalOpen}
        onClose={() => closeModal("addUser")}
      >
        <ModalContent className="max-w-[642px] min-h-[300px] top-[15%]">
          <div
            style={{ padding: "10px 15px 19px 28px" }}
            className="flex justify-between items-center"
          >
            <div
              style={{ position: "relative", top: "20px", color: "#071437" }}
              className="fz-16 font-semibold"
            >
              Добавить пользователя
            </div>

            {/* <button
              style={{
                width: "22px",
                height: "22px",
              }}
              className="ki-filled text-[x-large] text-[#99A1B7]"
              onClick={() => closeModal("addUser")}
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
            className="grid px-0 py-5 gap-2"
          >
            <div className="flex flex-col gap-5 lg:gap-6">
              <ModalInput
                text={"ФИО"}
                typeInput={"email"}
                value={value.fio || ""}
                onChange={(value) => handleInputChange("fio", value)}
                isInvalid={errors.fio}
              />
              <MultiSelect
                text={"Роль (выберите или введите самостоятельно)"}
                selectionItems={getRoles}
                onChange={(value) => handleInputChange("roles", value)}
                isInvalid={errors.roles}
              />
            </div>
            <div className="mt-0 lg:mt-2 lg:mt-0 flex gap-4 lg:gap-2 flex-col lg:flex-row">
              <ModalInput
                sz={"95%"}
                text={"Email"}
                typeInput={"email"}
                value={value.email}
                onChange={(value) => handleInputChange("email", value)}
                isInvalid={errors.email}
              />
              <ModalInput
                sz={"95%"}
                text={"Телефон"}
                typeInput={"email"}
                value={value.phone}
                onChange={(value) => handleInputChange("phone", value)}
                isInvalid={errors.phone}
              />
            </div>
            <div className="flex flex-col">
              <span className="fz-14 font-normal my-2 text-[#252F4A]">
                Создать пароль
              </span>
              <div className="mt-2 lg:mt-0 flex gap-4 lg:gap-2 flex-col lg:flex-row">
                <ModalInputPassword
                  sz={"95%"}
                  text={"Пароль"}
                  typeInput={"password"}
                  value={passwordData.password}
                  onChange={(value) => handlePasswordChange("password", value)}
                  isInvalid={errors.password}
                />
                <ModalInputPassword
                  sz={"95%"}
                  text={"Повторите пароль"}
                  typeInput={"password"}
                  value={passwordData.confirmPassword}
                  isInvalid={errors.confirmPassword}
                  onChange={(value) =>
                    handlePasswordChange("confirmPassword", value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col justify-between align-center">
              {/* {window.screen.width < 500 ? (
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
              )} */}

              <div className="w-full flex gap-4 mt-2 flex-col lg:flex-row">
                <button
                  class="btn btn-outline btn-success w-full lg:w-1/3 flex justify-center"
                  onClick={handleChangeRoles}
                >
                  Редактировать роли
                </button>
                {/* <button class="btn btn-outline btn-primary w-full flex justify-center">
                  Сменить пароль
                </button> */}
                <div className="w-full lg:w-2/3 flex gap-4">
                  <button
                    class="btn btn-outline btn-primary w-full flex justify-center"
                    onClick={() => closeModal("addUser")}
                  >
                    Отменить
                  </button>
                  <button
                    class="btn btn-primary w-full flex justify-center"
                    onClick={handleChangeCancel}
                  >
                    Добавить
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
export { ModalAddUser };
