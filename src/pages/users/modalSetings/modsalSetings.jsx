import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
} from "@/components/modal";
import { KeenIcon } from "@/components";
import { ModalContext } from "@/providers/ModalProvider";
import { ModalInput } from "../../../components/modalInput/modalInput";
import { ModalInputPassword } from "../../../components/modalInput/modalInputPassword";
import "react-toastify/dist/ReactToastify.css";
import { toast, Bounce } from "react-toastify";
import axios from "axios";
import { RenderUserInfoTable } from "./tableModal";
import { BASE_URL } from "../../../static";

const ModalSetingsUser = () => {
  const { isModalOpen, selectedRowData, closeModal, refreshTrigger } =
    useContext(ModalContext);

  const [value, setValue] = useState({
    vk: "",
    email: "",
    tg_id: "",
    balance: "",
    balance2: "",
    deleted: false,
    password: "",
    passwordCheck: "",
  });

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
    if (selectedRowData) {
      setValue((prev) => ({
        ...prev,
        vk: selectedRowData.vk_id || "",
        email: selectedRowData.email || "",
        tg_id: selectedRowData.username
          ? selectedRowData.username
          : selectedRowData?.tg_id || "",
        balance: "",
        balance2: "",
        deleted: selectedRowData.deleted || false,
        password: "", // всегда пустая строка
        passwordCheck: "", // всегда пустая строка
      }));
    }
  }, [selectedRowData]);

  const userInfo = [
    {
      x1: "Участий в конкурсе",
      x2: selectedRowData?.giveaways_count,
    },
    {
      x1: "Выполнено заданий",
      x2:
        selectedRowData?.completed_tasks === null
          ? 0
          : selectedRowData?.completed_tasks,
    },
    {
      x1: "Рефералов",
      x2: selectedRowData?.referals_count,
    },
    {
      x1: "Дата регистрации",
      x2: new Date(selectedRowData?.created_at).toLocaleDateString("ru-RU"),
    },
    {
      x1: "Дней на проекте",
      x2: selectedRowData?.days_in_project,
    },
    {
      x1: "Статус подписки",
      x2:
        selectedRowData?.gs_subscription !== "UNSUBSCRIBED"
          ? "Активна"
          : "Не активна",
    },
    {
      x1: "Баланс билетов",
      x2: Math.max(
        0,
        Number(selectedRowData?.balance || 0) +
          Number(value.balance || 0) -
          Number(value.balance2 || 0)
      ),
    },
    // {
    //   x1: "Статус аккаунта",
    //   x2:
    //     value.deleted || selectedRowData?.deleted ? "Заблокирован" : "Активен",
    // },
  ];

  const userDataPatchSave = async (objBody, textMsg) => {
    console.log("PATCH payload:", objBody);
    try {
      await axios.patch(`${BASE_URL}/users/${selectedRowData.id}`, objBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showAlert("success", textMsg);
      refreshTrigger();
    } catch (error) {
      showAlert("error", error.message || "Ошибка");
      console.error("Error fetching giveaways:", error);
    }
  };

  const handleInputChange = (key, newValue) => {
    console.log("handleInputChange", key, newValue);
    setValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleBanUser = () => {
    const newDeletedValue = !value.deleted;
    setValue((prev) => ({ ...prev, deleted: newDeletedValue }));

    const objBody = {
      deleted: newDeletedValue,
    };

    userDataPatchSave(objBody, "Статус пользователя успешно изменен");
  };

  const handleChangePassword = () => {
    console.log("Changing password to:", value.password, value.passwordCheck);

    if (value.password !== value.passwordCheck) {
      showAlert("error", "Пароли не совпадают");
      return;
    }
    if (!value.password) {
      showAlert("error", "Пароль не может быть пустым");
      return;
    }
    const objBody = {
      password: value.password,
    };

    userDataPatchSave(objBody, "Пароль успешно изменен");
  };

  const hanleModalForm = () => {
    const objBody = {
      balance: value.balance - value.balance2,
      // при необходимости можно добавить другие поля здесь
    };

    closeModal("userSettings");
    refreshTrigger();
    userDataPatchSave(objBody, "Данные успешно обновлены");
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={() => closeModal("userSettings")}>
        <ModalContent className="max-w-[642px] top-[10%]">
          <ModalHeader>
            <div className="font-bold text-lg text-[#071437]">
              Данные пользователя
            </div>
          </ModalHeader>
          <ModalBody
            style={{ padding: "16px" }}
            className="grid px-0 py-5 gap-5"
          >
            <RenderUserInfoTable data={userInfo} />

            <div className="pointer-events-none opacity-50">
              <ModalInput
                text={"Telegram"}
                typeInput={"email"}
                value={
                  selectedRowData?.username
                    ? selectedRowData?.username
                    : selectedRowData?.tg_id
                }
                onChange={(v) => handleInputChange("tg_id", v)}
              />
            </div>

            <div className="flex flex-col align-center gap-5">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-3 pointer-events-none opacity-50">
                  <div className="w-full lg:w-1/2">
                    <ModalInput
                      sz={"95%"}
                      text={"Email"}
                      typeInput={"email"}
                      value={value.email}
                      onChange={(v) => handleInputChange("email", v)}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <ModalInput
                      sz={"95%"}
                      text={"VK"}
                      typeInput={"email"}
                      value={selectedRowData?.vk_id}
                      onChange={(v) => handleInputChange("vk_id", v)}
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-5 lg:gap-3">
                  <div className="w-full lg:w-1/2">
                    <ModalInput
                      sz={"95%"}
                      text={"Начислить билеты"}
                      typeInput={"number"}
                      value={value.balance}
                      onChange={(v) => handleInputChange("balance", v)}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <ModalInput
                      sz={"95%"}
                      text={"Списать билеты"}
                      typeInput={"number"}
                      value={value.balance2}
                      onChange={(v) => handleInputChange("balance2", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <p className="fz-[14px] hidden lg:inline">Изменить пароль</p>
                <div className="flex flex-col lg:flex-row gap-5">
                  <ModalInputPassword
                    customStyle=""
                    sz={"95%"}
                    text={"Новый пароль"}
                    typeInput={"password"}
                    onChange={(v) => handleInputChange("password", v)}
                  />

                  <ModalInputPassword
                    customStyle=""
                    sz={"95%"}
                    text={"Повторите новый пароль"}
                    typeInput={"password"}
                    onChange={(v) => handleInputChange("passwordCheck", v)}
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <div className="flex gap-3 w-full lg:w-2/3">
                  <button
                    className="btn btn-outline btn-danger w-full flex justify-center"
                    onClick={handleBanUser}
                  >
                    {value?.deleted ? "Разбанить" : "Бан"}
                  </button>
                  <button
                    className="btn btn-outline btn-primary w-full flex justify-center"
                    onClick={handleChangePassword}
                  >
                    Сменить пароль
                  </button>
                </div>
                <button
                  className="btn btn-primary w-full lg:w-1/3 flex justify-center"
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

export { ModalSetingsUser };
