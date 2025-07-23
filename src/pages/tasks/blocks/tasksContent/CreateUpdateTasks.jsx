import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { Select as AntSelect } from "antd";
import { Input } from "antd";
import { useNavigate, useParams, useLocation } from "react-router";
import axios from "axios";
import { Textarea } from "../../../../components/textarea/textarea";
import cn from "classnames";
import { InputField } from "../../../../components/inputField/inputField";
import { ImageUpload } from "../../../../components/imageUpload/imageUpload";
import { BASE_URL } from "../../../../static";
import { deleteTask } from "./TasksData";
import { TimePicker } from "../../../../components/timepicker/TimePicker";
import { toast, Bounce } from "react-toastify";

const { TextArea } = Input;
const { Option } = AntSelect;

const getIndicatorColor = (value) => {
  if (String(value) === "true") return "#04B440";
  if (String(value) === "false") return "#DFA000";
  return null;
};

const deriveTypeFromTarget = (target) => {
  if (["vk", "tg"].includes(target)) {
    return { taskType: "social", targetOption: target };
  }
  if (["bk_betboom", "bk_pari", "bk_fonbet"].includes(target)) {
    return { taskType: "bookmaker", targetOption: target };
  }
  if (target === "custom") {
    return { taskType: "custom", targetOption: "custom" };
  }
  return { taskType: "social", targetOption: "" };
};

export const CreateUpdateTasks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [taskType, setTaskType] = useState("social");
  const [targetOption, setTargetOption] = useState("");

  const checkTypeOptions =
    taskType === "social"
      ? [
          { label: "Автоматически", value: "auto" },
          { label: "Ручной", value: "handle" },
          { label: "Таймер", value: "timer" },
        ]
      : [
          { label: "Таймер", value: "timer" },
          { label: "Ручной", value: "handle" },
          { label: "Постбэк", value: "postback" },
        ];

  const [errors, setErrors] = useState({
    redirect_url: false,
    tg_chat_id: false,
    postback_url: false,
    title: false,
    check_type: false,
    description: false,
  });

  const [giveawayOptions, setGiveawayOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/tasks/supported_giveaways`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })
      .then((res) => {
        const formattedOptions = res.data.map((item) => ({
          value: item.id,
          label: `ID:${item.id} — "${item.name}"`,
        }));
        setGiveawayOptions(formattedOptions);
      })
      .catch((err) => console.error("Ошибка загрузки конкурсов:", err));
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    is_active: true,
    reward: 0,
    subtitle: "",
    redirect_url: "",
    tg_chat_id: "",
    check_type: "handle",
    complete_count: "",
    description: "",
    photo: "",
    giveaway_id: "",
    postback_url: "",
    timer: "",
  });

  const handleTimeChange = (e) => {
    let raw = e.target.value;
    let digits = raw.replace(/\D/g, "").slice(0, 6);
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
    }
    if (digits.length >= 3) {
      formatted += ":" + digits.slice(2, 4);
    } else if (digits.length >= 2) {
      formatted += ":";
    }
    if (digits.length >= 5) {
      formatted += ":" + digits.slice(4, 6);
    } else if (digits.length >= 4) {
      formatted += ":";
    }
    setFormData((prev) => ({ ...prev, timer: formatted }));
  };

  const [loading, setLoading] = useState(false);
  const taskItem = location.state?.taskItem;

  useEffect(() => {
    if (taskItem) {
      setFormData({
        title: taskItem.title,
        is_active: taskItem.is_active,
        reward: taskItem.reward,
        subtitle: taskItem.subtitle,
        redirect_url: taskItem.redirect_url,
        tg_chat_id: taskItem.tg_chat_id,
        check_type: taskItem.check_type,
        complete_count: taskItem.complete_count,
        description: taskItem.description,
        giveaway_id: taskItem.giveaway_id,
        photo: taskItem.photo ? `${taskItem.photo}` : null,
        postback_url: taskItem.postback_url || "",
        timer: taskItem.timer || "",
      });
      const { taskType, targetOption } = deriveTypeFromTarget(taskItem.target);
      setTaskType(taskType);
      setTargetOption(targetOption);
    } else if (id) {
      axios
        .get(`${BASE_URL}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        })
        .then((res) => {
          const {
            title,
            is_active,
            reward,
            subtitle,
            redirect_url,
            tg_chat_id,
            check_type,
            complete_count,
            description,
            photo,
            postback_url,
            timer,
            target,
          } = res.data;
          setFormData({
            title,
            is_active,
            reward,
            subtitle,
            redirect_url,
            tg_chat_id,
            check_type,
            complete_count,
            description,
            photo: photo ? `${BASE_URL}${photo}` : null,
            postback_url: postback_url || "",
            timer: timer || "",
          });
          const { taskType, targetOption } = deriveTypeFromTarget(target);
          setTaskType(taskType);
          setTargetOption(targetOption);
        })
        .catch((err) => console.error("Ошибка загрузки задания", err));
    }
  }, [id, taskItem]);

  const handleChange = (field) => (e) => {
    const value = e?.target?.value ?? e;

    if (field === "check_type") {
      let updatedFields = {};

      if (value === "timer") {
        updatedFields = { postback_url: "" };
      } else if (value === "postback") {
        updatedFields = { timer: "" };
      } else {
        updatedFields = { timer: "", postback_url: "" };
      }

      setFormData((prev) => ({
        ...prev,
        [field]: value,
        ...updatedFields,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
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

  const validateForm = () => {
    const newErrors = {
      title: !formData.title,
      description: !formData.description,
      target: !targetOption,
      tg_chat_id: targetOption === "tg" && !formData.tg_chat_id,
      postback_url:
        formData.check_type === "postback" && !formData.postback_url,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      showAlert("error", "Заполните обязательные поля");
    }

    return !hasError;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Прекратить выполнение, если форма невалидна
    }
    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `${BASE_URL}/tasks/${id}` : `${BASE_URL}/tasks/task`;

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo" && typeof value === "string") {
          return;
        }
        // ► ОТФИЛЬТРОВЫВАЕМ tg_chat_id ◄
        if (key === "tg_chat_id" && targetOption !== "tg") return;
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });
      if (targetOption) {
        dataToSend.append("target", targetOption);
      }

      await axios({
        method,
        url,
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/tasks");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddMore = async () => {
    if (!validateForm()) {
      return; // Прекратить выполнение, если форма невалидна
    }
    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id ? `${BASE_URL}/tasks/${id}` : `${BASE_URL}/tasks/task`;

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photo" && typeof value === "string") {
          return;
        }
        // ► ОТФИЛЬТРОВЫВАЕМ tg_chat_id ◄
        if (key === "tg_chat_id" && targetOption !== "tg") return;
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });
      if (targetOption) {
        dataToSend.append("target", targetOption);
      }

      await axios({
        method,
        url,
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        title: "",
        is_active: true,
        reward: "",
        subtitle: "",
        redirect_url: "",
        tg_chat_id: "",
        check_type: "auto",
        complete_count: "",
        description: "",
        photo: "",
        postback_url: "", // сбрасываем postback_url
        timer: "",
      });

      navigate("/tasks/create-update-tasks");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      navigate("/tasks");
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Настройки задания
      </div>
      <div className="card card-grid h-full min-w-full pb-4">
        <div className="card-header">
          <h3 className="card-title">Задание</h3>
        </div>
        <div className="flex flex-col lg:flex-row px-4 gap-4 mt-4">
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div
                className={cn({
                  "pointer-events-none opacity-50": taskType === "bookmaker",
                })}
              >
                <ImageUpload
                  value={formData.photo}
                  onChange={(file) => {
                    setFormData((prev) => ({
                      ...prev,
                      photo: file,
                    }));
                  }}
                />
              </div>

              <div className="w-full flex flex-col gap-4">
                <InputField
                  text="Название задания"
                  value={formData.title}
                  onChange={handleChange("title")}
                  isInvalid={errors.title}
                />
                <div className="min-[744px]:flex gap-4">
                  {taskItem ? (
                    <div className="min-[744px]:w-1/2 mb-4 lg:mb-0">
                      <InputField text="ID задания" value={id} disabled />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div
                    className={
                      taskItem ? `min-[744px]:w-1/2` : `min-[744px]:w-full`
                    }
                  >
                    <Select
                      isStatus={true}
                      text="Статус"
                      value={formData.is_active} // boolean
                      onChange={
                        (e) =>
                          handleChange("is_active")(e.target.value === "true") // строка → boolean
                      }
                      options={[
                        { label: "Активно", value: true },
                        { label: "Отключено", value: false },
                      ]}
                    />
                  </div>
                </div>
                <div className="w-full flex gap-4">
                  <div className="w-1/5">
                    <InputField
                      text="Награда"
                      value={formData.reward}
                      onChange={handleChange("reward")}
                    />
                  </div>
                  <div className="w-5/6">
                    <InputField
                      text="Подпись"
                      value={formData.subtitle}
                      onChange={handleChange("subtitle")}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full relative">
              <label
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                }}
              >
                Тип задания
              </label>
              <AntSelect
                value={taskType}
                onChange={(value) => {
                  setTaskType(value);

                  if (value === "custom") {
                    setTargetOption("custom");
                  } else {
                    setTargetOption("");
                  }

                  // Определяем допустимые опции для check_type
                  let newCheckType = "auto";
                  if (value === "social") {
                    newCheckType = "auto";
                  } else if (value === "bookmaker") {
                    newCheckType = "timer";
                  } else if (value === "custom") {
                    newCheckType = "timer";
                  }

                  setFormData((prev) => ({
                    ...prev,
                    check_type: newCheckType,
                  }));
                }}
                className="input ps-0 pe-0 border-none w-full"
                options={[
                  { label: "Социальные сети", value: "social" },
                  { label: "Букмекеры", value: "bookmaker" },
                  { label: "Кастом", value: "custom" },
                ]}
              />
            </div>

            {taskType === "social" && (
              <div className="w-full relative">
                <label
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                  }}
                >
                  Социальные сети
                </label>
                <AntSelect
                  status={errors.target ? "error" : ""}
                  value={targetOption}
                  onChange={(val) => {
                    setTargetOption(val);

                    // если Telegram больше не выбран – чистим поле
                    if (val !== "tg") {
                      setFormData((prev) => ({ ...prev, tg_chat_id: "" }));
                    }
                  }}
                  className="input ps-0 pe-0 border-none w-full"
                  options={[
                    { label: "Вконтакте", value: "vk" },
                    { label: "Telegram", value: "tg" },
                  ]}
                />
              </div>
            )}

            {taskType === "bookmaker" && (
              <div className="w-full relative">
                <label
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                  }}
                >
                  Букмекеры
                </label>
                <AntSelect
                  status={errors.target ? "error" : ""}
                  value={targetOption}
                  onChange={(val) => setTargetOption(val)}
                  className="input ps-0 pe-0 border-none w-full"
                  options={[
                    { label: "BetBoom", value: "bk_betboom" },
                    { label: "Pari", value: "bk_pari" },
                    { label: "FonBet", value: "bk_fonbet" },
                  ]}
                />
              </div>
            )}

            <InputField
              text="Ссылка"
              value={formData.redirect_url}
              onChange={handleChange("redirect_url")}
              isInvalid={errors.redirect_url}
            />
            {targetOption === "tg" && (
              <InputField
                text="ID Telegram канала"
                value={formData.tg_chat_id}
                onChange={handleChange("tg_chat_id")}
                isInvalid={errors.tg_chat_id}
              />
            )}
            <div className="min-[744px]:flex gap-4">
              <div
                className={cn("w-full", {
                  "min-[744px]:w-2/3": formData.check_type === "timer",
                  "min-[744px]:w-1/2": formData.check_type === "postback",
                  "min-[744px]:w-full":
                    formData.check_type === "auto" ||
                    formData.check_type === "handle",
                })}
              >
                <div className="w-full relative">
                  <label
                    style={{
                      color: "#99A1B7",
                      fontSize: "11px",
                      display: "inline",
                      marginBottom: "0px",
                    }}
                    className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                  >
                    Тип проверки
                  </label>
                  <AntSelect
                    value={formData.check_type}
                    onChange={handleChange("check_type")}
                    className={`input ps-0 pe-0 border-none w-full`}
                    options={checkTypeOptions}
                  />
                </div>
              </div>
              {/* {formData.check_type === "timer" && (
                <div className="min-[744px]:w-1/3">
                  <InputField
                    text="Время (ЧЧ:ММ:СС)"
                    value={formData.timer}
                    onChange={handleTimeChange}
                    type="text"
                    placeholder="00:00:00"
                    maxLength={8}
                  />
                </div>
              )} */}
              {formData.check_type === "timer" && (
                <div className="min-[744px]:w-1/3 mt-4 lg:mt-0">
                  {/* <label
                    style={{
                      // top: "11px",
                      // left: "10px",
                      color: "#99A1B7",
                      background: "#fcfcfc",
                      fontSize: "11px",
                      display: "inline",
                      marginBottom: "0px",
                    }}
                    className="absolute top-[-9px] left-2 z-10 text-sm font-medium text-gray-900"
                  >
                    Время таймера
                  </label> */}
                  <TimePicker
                    value={formData.timer}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, timer: val }))
                    }
                  />
                </div>
              )}

              {formData.check_type === "postback" && (
                <div className="min-[744px]:w-1/2">
                  <InputField
                    required
                    text="Ссылка"
                    value={formData.postback_url}
                    onChange={handleChange("postback_url")}
                    isInvalid={errors.postback_url}
                  />
                </div>
              )}
            </div>
            <div className="w-full relative">
              <label
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                  display: "inline",
                  marginBottom: "0px",
                }}
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              >
                Добавить участие в конкурсе по ID, как на награду
              </label>
              <AntSelect
                value={formData.giveaway_id || ""}
                onChange={handleChange("giveaway_id")}
                className="input ps-0 pe-0 border-none w-full"
                options={[
                  { label: "Не выбрано", value: "" },
                  ...giveawayOptions,
                ]}
              />
            </div>
          </div>
          <div className="lg:w-1/2 relative min-h-full">
            {/* <Textarea
              text="Описание задания"
              value={formData.description}
              onChange={handleChange("description")}
              height={320}
              className="textarea textarea-bordered"
            /> */}
            <label
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              style={{
                color: "#99A1B7",
                fontSize: "11px",
              }}
            >
              Описание задания
            </label>
            <TextArea
              className="!min-h-[150px] "
              value={formData.description}
              onChange={handleChange("description")}
              style={{ height: "100%", resize: "none" }}
              status={errors.description ? "error" : ""}
            />
          </div>
        </div>
      </div>
      <div className="lg:flex-row flex flex-col gap-4 pt-4 justify-between">
        {/* <button
          className="lg:w-1/4 py-2 flex justify-center btn btn-outline btn-danger"
          onClick={() => handleDelete(id)}
        >
          Удалить
        </button> */}
        <button
          className="w-full lg:w-1/3 flex justify-center btn btn-outline btn-primary"
          onClick={handleSaveAndAddMore}
        >
          Сохранить и добавить еще
        </button>
        <div className="w-full lg:w-2/3 flex flex-row gap-4">
          <button
            className="w-full lg:w-full flex justify-center btn btn-outline btn-primary"
            onClick={() => navigate("/tasks")}
          >
            Отмена
          </button>
          <button
            className="w-full lg:w-full flex justify-center btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
