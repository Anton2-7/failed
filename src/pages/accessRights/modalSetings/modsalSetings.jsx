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
import { ModalInputPassword } from "../../../components/modalInput/modalInputPassword";
import "react-toastify/dist/ReactToastify.css";
import { toast, Bounce } from "react-toastify";
import { BASE_URL } from "../../../static";
import axios from "axios";
import { RenderUserInfoTable } from "./tableModal";
import { BASE_URL } from "../../../static";

const { refreshTrigger } = useContext(ModalContext);

const ModalSetingsUser = () => {
  const { isModalOpen, selectedRowData, closeModal, updateDataModal } =
    useContext(ModalContext);
  const [value, setValue] = useState({
    vk: selectedRowData?.vk_id || "",
    email: selectedRowData?.email || "",
    tg_id: selectedRowData?.username
      ? selectedRowData.username
      : selectedRowData?.tg_id || "",
    balance: 0,
    balance2: 0,
    deleted: selectedRowData?.deleted || false,
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
      console.log("selectedRowData", selectedRowData.username);

      setValue({
        vk: selectedRowData.vk_id || "",
        email: selectedRowData.email || "",
        tg_id: selectedRowData.username
          ? selectedRowData.username
          : selectedRowData?.tg_id || "",
        balance: 0,
        balance2: 0,
        deleted: selectedRowData.deleted || false,
        password: selectedRowData.password || "",
      });
    }
  }, [selectedRowData]);
  // useEffect(() => {
  //   console.log("Updated value:", value);
  // }, [value]); // Зависимость от `value`

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
      x2:
        Number(selectedRowData?.balance) +
          Number(value.balance - value.balance2) || selectedRowData?.balance,
    },
    {
      x1: "Статус аккаунта",
      x2:
        value.deleted || selectedRowData?.deleted ? "Заблокирован" : "Активен",
    },
  ];
  const scrollableHeight = 300;

  const userDataPatchSave = async (objBody, textMsg) => {
    try {
      await axios.patch(`${BASE_URL}/users/${selectedRowData.id}/`, objBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      showAlert("success", textMsg);
      updateDataModal(selectedRowData.id);
      refreshTrigger();
    } catch (error) {
      showAlert("error", error);
      console.error("Error fetching giveaways:", error);
    }
  };

  useEffect(() => {}, []);
  const handleInputChange = (key, value) => {
    setValue((prev) => ({ ...prev, [key]: value }));
  };

  const handleBanUser = () => {
    const newDeletedValue = !value.deleted; // Вычисляем новое значение

    setValue((prev) => ({ ...prev, deleted: newDeletedValue })); // Обновляем состояние

    console.log("deleted", newDeletedValue);

    const objBody = {
      deleted: newDeletedValue,
    };
    console.log("objBody", objBody);

    userDataPatchSave(objBody, "статус пользователя успешно изменен");
  };
  const handleChangePassword = () => {
    if (value.password !== value.passwordCheck) {
      showAlert("error", "Пароли не совпадают");
      return;
    }
    const objBody = {
      password: value.password,
    };

    userDataPatchSave(objBody, "пароль успешно изменен");
  };

  const hanleModalForm = () => {
    const objBody = {
      vk: value.vk_id,
      email: value.email,
      tg_id: value.tg_id,
      balance: value.balance - value.balance2,
    };
    console.log("objBody", objBody);
    refreshTrigger();

    userDataPatchSave(objBody, "даненые успешно обновлены");
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={closeModal}>
        <ModalContent className="max-w-[642px] top-[15%]">
          <ModalHeader>
            <div className="font-bold">Данные пользователя</div>

            <button
              style={{ border: "solid 1px #C4C4C4" }}
              className="btn btn-sm btn-icon btn-light btn-clear shrink-0"
              onClick={closeModal}
            >
              <KeenIcon icon="cross" />
            </button>
          </ModalHeader>
          <ModalBody style={{ padding: "16px" }} className="grid  px-0 py-5 ">
            <RenderUserInfoTable data={userInfo} />

            <div style={{ position: "relative", top: "-6px" }}>
              <ModalInput
                text={"Telegram"}
                typeInput={"text"}
                value={
                  selectedRowData?.username
                    ? selectedRowData?.username
                    : selectedRowData?.tg_id
                }
                onChange={(value) => handleInputChange("tg_id", value)}
              />
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
                  >
                    <ModalInput
                      text={"Email"}
                      typeInput={"email"}
                      value={value.email}
                      onChange={(value) => handleInputChange("email", value)}
                    />
                    <ModalInput
                      text={"VK"}
                      typeInput={"text"}
                      value={selectedRowData?.vk_id}
                      onChange={(value) => handleInputChange("vk_id", value)}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      top: "-20px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="flex"
                  >
                    <ModalInput
                      text={"Начислить билеты"}
                      typeInput={"number"}
                      value={value.balance}
                      onChange={(value) => handleInputChange("balance", value)}
                    />
                    <ModalInput
                      text={"Списать билеты"}
                      typeInput={"number"}
                      value={value.balance2}
                      onChange={(value) => handleInputChange("balance2", value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col ">
                  <div
                    style={{ position: "relative", top: "-15px", left: "2px" }}
                    className="flex gap-2"
                  >
                    <ModalInput
                      sz={"95%"}
                      text={"Email"}
                      typeInput={"email"}
                      value={value.email}
                      onChange={(value) => handleInputChange("email", value)}
                    />
                    <ModalInput
                      sz={"95%"}
                      text={"VK"}
                      typeInput={"text"}
                      value={selectedRowData?.vk_id}
                      onChange={(value) => handleInputChange("vk_id", value)}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      top: "-20px",
                    }}
                    className="flex gap-2"
                  >
                    <ModalInput
                      sz={"95%"}
                      text={"Начислить билеты"}
                      typeInput={"number"}
                      value={value.balance}
                      onChange={(value) => handleInputChange("balance", value)}
                    />
                    <ModalInput
                      sz={"95%"}
                      text={"Списать билеты"}
                      typeInput={"number"}
                      value={value.balance2}
                      onChange={(value) => handleInputChange("balance2", value)}
                    />
                  </div>
                </div>
              )}

              {window.screen.width > 500 ? (
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      top: "-11px",
                    }}
                    className="fz-[14px]"
                  >
                    Изменить пароль
                  </p>
                  <div
                    style={{ position: "relative", top: "-23px" }}
                    className="flex gap-2"
                  >
                    <ModalInputPassword
                      customStyle=""
                      sz={"95%"}
                      text={"Новый пароль"}
                      typeInput={"password"}
                      onChange={(value) => handleInputChange("password", value)}
                    />

                    <ModalInputPassword
                      customStyle=""
                      sz={"95%"}
                      text={"Повторите новый пароль"}
                      typeInput={"password"}
                      onChange={(value) =>
                        handleInputChange("passwordCheck", value)
                      }
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      position: "relative",
                      top: "-11px",
                    }}
                    className="fz-[14px]"
                  >
                    Изменить пароль
                  </p>
                  <div
                    style={{ position: "relative", top: "-23px" }}
                    className="flex flex-col gap-2"
                  >
                    <ModalInputPassword
                      customStyle={
                        ({ sz: "100%" },
                        { position: "absolute" },
                        { top: "34%" },
                        { right: "3%" })
                      }
                      sz={"100%"}
                      text={"Новый пароль"}
                      typeInput={"password"}
                      onChange={(value) => handleInputChange("password", value)}
                    />

                    <ModalInputPassword
                      customStyle={
                        ({ sz: "100%" },
                        { position: 'position: "absolute"' },
                        { top: "77%" })
                      }
                      sz={"100%"}
                      text={"Повторите новый пароль"}
                      typeInput={"password"}
                      onChange={(value) =>
                        handleInputChange("passwordCheck", value)
                      }
                    />
                  </div>
                </div>
              )}
              <div
                style={{ position: "relative", top: "-8px" }}
                className="flex gap-2"
              >
                <button
                  class="btn btn-outline btn-danger w-full flex justify-center"
                  onClick={handleBanUser}
                >
                  {value?.deleted ? "Разбанить" : "Бан"}
                </button>
                <button
                  class="btn btn-outline btn-primary w-full flex justify-center"
                  onClick={handleChangePassword}
                >
                  Сменить пароль
                </button>
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
export { ModalSetingsUser };
