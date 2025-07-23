import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { Select as AntSelect } from "antd";
import { useNavigate, useParams, useLocation } from "react-router";
import axios from "axios";
import { Textarea } from "../../../../components/textarea/textarea";
import { InputField } from "../../../../components/inputField/inputField";
import { ImageUpload } from "../../../../components/imageUpload/imageUpload";
import { BASE_URL } from "../../../../static";
import { deleteMailing } from "./MailingData";
import { TimePicker } from "../../../../components/timepicker/TimePicker";
import { DatePicker } from "antd";
import dayjs from "../../../dashboard/dayjsConfig";
import { Switch, Input } from "antd";
import { Dropdown, Menu } from "antd";
import { ChevronDown } from "lucide-react";
import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { toast, Bounce } from "react-toastify";
import clsx from "clsx";
import { SingleDateTimePicker } from "../../../dashboard/blocks/SingleDateTimePicker";
const { TextArea } = Input;

export const CreateUpdateMailing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [triggersList, setTriggersList] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   const fetchTasks = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}/tasks/`);
  //       const taskItems = res.data.items.map((task) => ({
  //         key: task.id,
  //         label: task.title,
  //       }));
  //       setTasks(taskItems);
  //     } catch (error) {
  //       console.error("Ошибка при загрузке заданий:", error);
  //     }
  //   };

  //   fetchTasks();
  // }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/info/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const items = res.data.map((g) => ({
          key: g.id,
          label: g.name,
        }));
        setTasks(items);
      } catch (error) {
        console.error("Ошибка при загрузке конкурсов:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/info/giveaways`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        const items = res.data.map((g) => ({
          key: g.id,
          label: g.name,
        }));
        setGiveaways(items);
      } catch (error) {
        console.error("Ошибка при загрузке конкурсов:", error);
      }
    };

    fetchGiveaways();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    photo: "",
    type: "one_time",
    title: "",
    button_text: "",
    button_url: "",
    triggers: {},
    shedulet_at: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  const mailingItem = location.state?.mailingItem;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/campaigns/triggers`)
      .then((res) => {
        setTriggersList(res.data);
      })
      .catch((err) => console.error("Ошибка загрузки триггеров:", err));
  }, []);

  useEffect(() => {
    if (mailingItem) {
      setFormData({
        name: mailingItem.name,
        text: mailingItem.text,
        photo: mailingItem.photo ? `${mailingItem.photo}` : null,
        type: mailingItem.type,
        title: mailingItem.title,
        button_text: mailingItem.button_text,
        button_url: mailingItem.button_url,
        triggers: mailingItem.triggers.reduce((acc, trigger) => {
          acc[trigger.id] = trigger.trigger_params;
          return acc;
        }, {}),

        shedulet_at: mailingItem.shedulet_at,
        is_active: mailingItem.is_active,
      });
    } else if (id) {
      axios
        .get(`${BASE_URL}/mailing/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        })
        .then((res) => {
          const {
            name,
            text,
            photo,
            type,
            title,
            button_text,
            button_url,
            triggers,
            shedulet_at,
            is_active,
          } = res.data;
          setFormData({
            name,
            text,
            photo: photo ? `${BASE_URL}${photo}` : null,
            type,
            title,
            button_text,
            button_url,
            triggers,
            shedulet_at,
            is_active,
          });
        })
        .catch((err) => console.error("Ошибка загрузки задания", err));
    }
  }, [id, mailingItem]);

  const handleTriggerChange = (triggerId, paramName, value) => {
    setFormData((prev) => {
      const updatedTriggers = {
        ...prev.triggers,
        [triggerId]: {
          ...prev.triggers[triggerId],
          [paramName]: value,
        },
      };
      return {
        ...prev,
        triggers: updatedTriggers,
      };
    });
  };

  const handleTriggerToggle = (id) => {
    setFormData((prev) => {
      const isOneTime = prev.type === "one_time";
      const isTriggerAlreadySelected = id in prev.triggers;

      let newTriggers = {};

      if (isOneTime) {
        // можно несколько: просто добавляем или удаляем
        newTriggers = { ...prev.triggers };
        if (isTriggerAlreadySelected) {
          delete newTriggers[id];
        } else {
          const trigger = triggersList.find((t) => t.id === id);
          newTriggers[id] = trigger?.trigger_params ?? null;
        }
      } else {
        // тип "trigger" — только один, заменяем на новый или удаляем
        if (isTriggerAlreadySelected) {
          newTriggers = {};
        } else {
          const trigger = triggersList.find((t) => t.id === id);
          newTriggers = {
            [id]: trigger?.trigger_params ?? null,
          };
        }
      }

      return {
        ...prev,
        triggers: newTriggers,
      };
    });
  };

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

  const [errors, setErrors] = useState({
    name: false,
    text: false,
    shedulet_at: false,
  });

  // const validateForm = () => {
  //   if (!formData.name) {
  //     showAlert("error", "Введите название");
  //     return false;
  //   }
  //   if (!formData.title) {
  //     showAlert("error", "Введите заголовок");
  //     return false;
  //   }
  //   if (!formData.text) {
  //     showAlert("error", "Введите текст рассылки");
  //     return false;
  //   }
  //   if (!formData.button_text) {
  //     showAlert("error", "Введите текст кнопки");
  //     return false;
  //   }
  //   if (!formData.button_url) {
  //     showAlert("error", "Введите ссылку на кнопке");
  //     return false;
  //   }

  //   // Триггеры обязательны только если тип — "trigger" (т.е. "Регулярная")
  //   if (
  //     formData.type === "trigger" &&
  //     Object.keys(formData.triggers).length === 0
  //   ) {
  //     showAlert(
  //       "error",
  //       "Выберите хотя бы один триггер для регулярной рассылки"
  //     );
  //     return false;
  //   }

  //   // Дата и время обязательны только если тип — "one_time" (Разовая)
  //   if (formData.type === "one_time" && !formData.shedulet_at) {
  //     showAlert(
  //       "error",
  //       "Введите дату и время начала рассылки для разовой рассылки"
  //     );
  //     return false;
  //   }

  //   return true;
  // };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      text: !formData.text,
      shedulet_at: formData.type === "one_time" && !formData.shedulet_at,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      showAlert("error", "Заполните обязательные поля");
    }
    if (
      formData.type === "trigger" &&
      Object.keys(formData.triggers).length === 0
    ) {
      showAlert("error", "Выберите хотя бы один триггер");
      return false;
    }

    return !hasError;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id
        ? `${BASE_URL}/campaigns/${id}`
        : `${BASE_URL}/campaigns/campaign`;

      // Собираем данные для отправки
      const dataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        // Фото — если это строка (URL), пропускаем
        if (key === "photo" && typeof value === "string") return;
        console.log("formData.type:", formData.type);
        console.log("formData.triggers:", formData.triggers);

        // Обработка триггеров
        if (key === "triggers") {
          const triggersToSend = Object.entries(value).map(
            ([triggerId, params]) => ({
              id: Number(triggerId),
              trigger_params: params ?? null,
            })
          );

          dataToSend.append(
            "triggers",
            JSON.stringify({ triggers: triggersToSend })
          );
          return;
        }

        // Все остальные поля — как есть
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });

      // Логируем перед отправкой
      console.log("FormData before sending:", dataToSend);

      await axios({
        method,
        url,
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/mailing");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndAddMore = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id
        ? `${BASE_URL}/campaigns/${id}`
        : `${BASE_URL}/campaigns/campaign`;

      const dataToSend = new FormData();
      console.log("Initial FormData", dataToSend); // Логируем перед добавлением данных

      Object.entries(formData).forEach(([key, value]) => {
        console.log(`Adding ${key}:`, value); // Логируем каждый ключ и его значение

        if (key === "photo" && typeof value === "string") {
          return;
        }

        if (value === "") {
          console.log(`${key} is empty`);
        }
        if (key === "triggers") {
          if (formData.type === "one_time") {
            dataToSend.append("triggers", JSON.stringify({ triggers: [] }));
          } else {
            const triggersToSend = Object.entries(value).map(
              ([triggerId, params]) => ({
                id: Number(triggerId),
                trigger_params: params ?? null,
              })
            );

            dataToSend.append(
              "triggers",
              JSON.stringify({ triggers: triggersToSend })
            );
          }
          return;
        }

        // Все остальные поля — как есть
        if (value !== undefined && value !== null) {
          dataToSend.append(key, value);
        }
      });

      // Проверяем, что в FormData перед отправкой
      console.log("FormData before sending:", dataToSend);

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
        name: "",
        text: "",
        photo: "",
        type: "",
        title: "",
        button_text: "",
        button_url: "",
        triggers: {},
        shedulet_at: "",
        is_active: true,
      });

      navigate("/mailing/create-update-mailing");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mailingId) => {
    try {
      await deleteMailing(mailingId);
      navigate("/mailing");
    } catch (error) {
      console.error("Не удалось удалить задание", error);
    }
  };

  const dayOptions = [1, 3, 5, 7];

  const items = dayOptions.map((day) => ({
    key: String(day),
    label: (
      <span
        onClick={() => handleTriggerChange(trigger.id, "inactive_days", day)}
      >
        {day}
      </span>
    ),
  }));

  const buildMenu = (triggerId, paramName, options) =>
    options.map((opt) => ({
      key: String(opt.key ?? opt),
      label: opt.label ?? opt,
    }));

  const renderTriggerComponent = (trigger) => {
    const params = trigger.trigger_params;

    const trigState = formData.triggers[trigger.id] || {};
    if (params === null) {
      return (
        <div className="flex justify-between items-center" key={trigger.id}>
          <div>{trigger.name}</div>
          <Switch
            checked={trigger.id in formData.triggers}
            onChange={() => handleTriggerToggle(trigger.id)}
          />
        </div>
      );
    }

    switch (trigger.name) {
      case "Не заходил Х дней": {
        const dayOptions = [1, 3, 5, 7];
        const menuItems = buildMenu(trigger.id, "inactive_days", dayOptions);
        const selectedDays = trigState.inactive_days ?? "X";
        return (
          <div className="flex justify-between items-center" key={trigger.id}>
            <div className="flex gap-1">
              Не заходил&nbsp;
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) =>
                      handleTriggerChange(trigger.id, "inactive_days", key)
                    }
                    items={menuItems}
                  />
                }
                trigger={["click"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="text-primary flex cursor-pointer"
                >
                  {selectedDays}
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              </Dropdown>
              &nbsp;
              {selectedDays === 1
                ? "день"
                : selectedDays === 2 || selectedDays === 3 || selectedDays === 4
                  ? "дня"
                  : "дней"}
            </div>
            <Switch
              checked={trigger.id in formData.triggers}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
      }

      case "Не тратил билеты Х дней": {
        const ticketDayOptions = [1, 3, 5, 7];
        const menuItems = buildMenu(
          trigger.id,
          "inactive_days",
          ticketDayOptions
        );
        const selectedTicketDays = trigState.inactive_days ?? "X";
        return (
          <div className="flex justify-between items-center" key={trigger.id}>
            <div className="flex gap-1">
              Не тратил билеты&nbsp;
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) =>
                      handleTriggerChange(trigger.id, "inactive_days", key)
                    }
                    items={menuItems}
                  />
                }
                trigger={["click"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="text-primary flex cursor-pointer"
                >
                  {selectedTicketDays}
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              </Dropdown>
              &nbsp;
              {selectedTicketDays === 1
                ? "день"
                : selectedTicketDays === 2 ||
                    selectedTicketDays === 3 ||
                    selectedTicketDays === 4
                  ? "дня"
                  : "дней"}
            </div>
            <Switch
              checked={trigger.id in formData.triggers}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
      }

      case "Не выполнил задание": {
        const selectedTask =
          tasks.find((t) => String(t.key) === String(trigState.task_id))
            ?.label ?? "задание";
        const menuItems = tasks.map((task) => ({
          key: String(task.key),
          label: task.label,
        }));

        return (
          <div className="flex justify-between items-center" key={trigger.id}>
            <div className="flex gap-1">
              Не выполнил&nbsp;
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) =>
                      handleTriggerChange(trigger.id, "task_id", key)
                    }
                    items={menuItems}
                  />
                }
                trigger={["click"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="text-primary flex cursor-pointer"
                >
                  {selectedTask}
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              </Dropdown>
            </div>
            <Switch
              checked={trigger.id in formData.triggers}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
      }

      case "До конца конкурса осталось времени": {
        const selectedGiveaway =
          giveaways.find((g) => String(g.key) === String(trigState.giveaway_id))
            ?.label ?? "конкурса";
        const menuItems = giveaways.map((giveaway) => ({
          key: String(giveaway.key),
          label: giveaway.label,
        }));
        const isActive = trigger.id in formData.triggers;
        const selectedTime = trigState.time
          ? dayjs(trigState.time, "HH:mm:ss")
          : null;

        return (
          <div className="flex justify-between items-center" key={trigger.id}>
            <div className="flex gap-1 flex-wrap">
              До конца&nbsp;
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) =>
                      handleTriggerChange(trigger.id, "giveaway_id", key)
                    }
                    items={menuItems}
                  />
                }
                trigger={["click"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="text-primary flex cursor-pointer"
                >
                  {selectedGiveaway}
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              </Dropdown>
              &nbsp;осталось&nbsp;
              {isActive ? (
                <TimePicker
                  mailingTimer
                  value={selectedTime?.format("HH:mm:ss")}
                  onChange={(value, timeStr) =>
                    handleTriggerChange(trigger.id, "time", timeStr)
                  }
                />
              ) : (
                <div className="flex">
                  <span className="text-primary">времени </span>
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              )}
            </div>
            <Switch
              checked={isActive}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
      }

      case "Не участвовал в конкурсe": {
        const selectedGiveaway =
          giveaways.find((g) => String(g.key) === String(trigState.giveaway_id))
            ?.label ?? "конкурсе";
        const menuItems = giveaways.map((giveaway) => ({
          key: String(giveaway.key),
          label: giveaway.label,
        }));

        return (
          <div className="flex justify-between items-center" key={trigger.id}>
            <div className="flex gap-1">
              Не участвовал в&nbsp;
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) =>
                      handleTriggerChange(trigger.id, "giveaway_id", key)
                    }
                    items={menuItems}
                  />
                }
                trigger={["click"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="text-primary flex cursor-pointer"
                >
                  {selectedGiveaway}
                  <span className="text-[#99A1B7]">
                    <ChevronDown />
                  </span>
                </div>
              </Dropdown>
            </div>
            <Switch
              checked={trigger.id in formData.triggers}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
      }

      default:
        return (
          <div className="flex justify-between" key={trigger.id}>
            <div>{trigger.name}</div>
            <Switch
              checked={trigger.id in formData.triggers}
              onChange={() => handleTriggerToggle(trigger.id)}
            />
          </div>
        );
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Настройки рассылок
      </div>
      <div className="flex flex-col lg:flex-row gap-8 flex-grow">
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="card card-grid h-full min-w-full pb-4 flex flex-col">
            <div className="card-header">
              <h3 className="card-title">Рассылка</h3>
            </div>
            <div className="flex px-4 gap-4 pt-4 flex-col flex-grow overflow-auto">
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <ImageUpload
                    value={formData.photo}
                    onChange={(file) => {
                      setFormData((prev) => ({
                        ...prev,
                        photo: file,
                      }));
                    }}
                  />
                  <div className="w-full flex flex-col gap-4">
                    <InputField
                      text="Название"
                      value={formData.name}
                      onChange={handleChange("name")}
                      isInvalid={errors.name}
                    />
                    <InputField
                      text="Заголовок"
                      value={formData.title}
                      onChange={handleChange("title")}
                      isInvalid={errors.title}
                    />
                    <div className="flex flex-col lg:flex-row gap-4">
                      {mailingItem ? (
                        <div className="w-full lg:w-1/2">
                          <InputField text="ID рассылки" value={id} disabled />
                        </div>
                      ) : (
                        <></>
                      )}
                      <div
                        className={mailingItem ? `w-full lg:w-1/2` : `w-full`}
                      >
                        <Select
                          isStatus={true}
                          text="Статус"
                          value={formData.is_active} // boolean
                          onChange={
                            (e) =>
                              handleChange("is_active")(
                                e.target.value === "true"
                              ) // строка → boolean
                          }
                          options={[
                            { label: "Активна", value: true },
                            { label: "Приостановлена", value: false },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
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
                    Тип рассылки
                  </label>
                  <AntSelect
                    value={
                      formData.type === "trigger" ? "regular" : formData.type
                    }
                    onChange={(value) => {
                      const newType = value === "regular" ? "trigger" : value;
                      setFormData((prev) => ({
                        ...prev,
                        type: newType,
                        triggers: {}, // сброс всех триггеров при смене типа рассылки
                      }));
                    }}
                    className="input ps-0 pe-0 border-none w-full"
                    options={[
                      { label: "Разовая", value: "one_time" },
                      { label: "Регулярная", value: "regular" }, // показываем как "Регулярная", храним как "trigger"
                    ]}
                  />
                </div>
                {/* <div className="">
                  <Select
                    text="Тип рассылки"
                    value={formData.type}
                    onChange={handleChange("type")}
                    options={[
                      { label: "Триггер", value: "trigger" },
                      { label: "Разовая", value: "one_time" },
                      { label: "Регулярная", value: "regular" },
                    ]}
                  />
                </div> */}
                <InputField
                  text="Текст кнопки"
                  value={formData.button_text}
                  onChange={handleChange("button_text")}
                  isInvalid={errors.button_text}
                />
                <div>
                  <InputField
                    text="Ссылка на кнопке"
                    value={formData.button_url}
                    onChange={handleChange("button_url")}
                    isInvalid={errors.button_url}
                  />
                </div>
                <div className="hidden lg:block">
                  <SingleDateTimePicker
                    value={
                      formData.shedulet_at
                        ? new Date(formData.shedulet_at)
                        : null
                    }
                    onChange={(date) => {
                      setFormData((prev) => ({
                        ...prev,
                        shedulet_at: date
                          ? date.toISOString().slice(0, 16).replace("T", " ")
                          : "", // или null — зависит от контекста
                      }));
                    }}
                    placeholder="Дата и время начала рассылки"
                    isInvalid={errors.shedulet_at}
                  />
                </div>
                <div className="relative block lg:hidden">
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
                    Дата и время начала рассылки
                  </label>
                  <div className="hidden lg:flex">
                    {/* <DatePicker
                      className={clsx("input", {
                        "border-red-500 ring-2 ring-red-200":
                          errors.shedulet_at,
                      })}
                      placeholder=""
                      showTime={{ format: "HH:mm", showSecond: false }}
                      format="YYYY-MM-DD HH:mm"
                      value={
                        formData.shedulet_at
                          ? dayjs(formData.shedulet_at)
                          : null
                      }
                      onChange={(value, dateString) => {
                        setFormData((prev) => ({
                          ...prev,
                          shedulet_at: dateString,
                        }));
                      }}
                    /> */}
                  </div>
                  <div className="block lg:hidden">
                    <FlexibleDateTimePicker
                      mode="single"
                      withTime={true}
                      value={
                        formData.shedulet_at
                          ? [dayjs(formData.shedulet_at)]
                          : []
                      }
                      onChange={(val) => {
                        const selected = val?.[0];
                        setFormData((prev) => ({
                          ...prev,
                          shedulet_at: selected
                            ? selected.format("YYYY-MM-DD HH:mm")
                            : "",
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
            //   className={`${formData.type === "trigger" ? "" : "pointer-events-none opacity-60"}`}
            >
              <div className="card-header border-t mt-4">
                <h3 className="card-title">Триггеры</h3>
              </div>
              <div className="flex flex-col px-4 gap-4 mt-4">
                {triggersList.map(renderTriggerComponent)}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative min-h-full flex flex-col">
          <div className="card card-grid min-w-full flex-grow pb-4">
            <div className="card-header">
              <h3 className="card-title">Текст рассылки</h3>
            </div>
            <div className="flex px-4 gap-4 mt-4 flex-grow">
              <div className="w-full flex flex-col gap-4">
                <div className="relative flex-grow">
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
                    className="!min-h-[150px]"
                    value={formData.text}
                    onChange={handleChange("text")}
                    style={{ height: "100%", resize: "none" }}
                    status={errors.text ? "error" : ""}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:flex-row flex flex-col gap-4 pt-4 justify-between">
            <button
              className="lg:w-1/3 flex justify-center btn btn-outline btn-primary"
              onClick={handleSaveAndAddMore}
              disabled={loading}
            >
              Применить и добавить еще
            </button>
            <div className="lg:w-2/3 flex gap-4">
              <button
                className="lg:w-1/2 w-full flex justify-center btn btn-outline btn-primary"
                onClick={() => navigate("/mailing")}
              >
                Отмена
              </button>
              <button
                className={`lg:w-1/2 w-full flex justify-center btn btn-primary`}
                onClick={handleSave}
                disabled={loading}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
