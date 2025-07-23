import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { useNavigate, useParams, useLocation } from "react-router";
import axios from "axios";
import { deleteDocumentation } from "./DocumentationData";
import { Textarea } from "../../../../components/textarea/textarea";
import { BASE_URL } from "../../../../static";
import { InputField } from "../../../../components/inputField/inputField";
import { toast, Bounce } from "react-toastify";
import { Input } from "antd";
const { TextArea } = Input;
// import ReactQuill from "react-quill";
// import 'react-quill/dist/quill.snow.css';

export const CreateUpdateDocumentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    text: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const documentationItem = location.state?.documentationItem;

  useEffect(() => {
    if (documentationItem) {
      setFormData({
        name: documentationItem.name,
        text: documentationItem.text,
        status: documentationItem.status,
      });
    } else if (id) {
      axios
        .get(`${BASE_URL}/docs_rules/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        })
        .then((res) => {
          const { name, text, status } = res.data;
          setFormData({ name, text, status });
        })
        .catch((err) => console.error("Ошибка загрузки вопроса", err));
    }
  }, [id, documentationItem]);

  const handleChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
  });

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      text: !formData.text,
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
      return;
    }
    setLoading(true);
    try {
      const method = id ? "patch" : "post";
      const url = id
        ? `${BASE_URL}/docs_rules/${id}`
        : `${BASE_URL}/docs_rules/`;

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      navigate("/documentation");
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
        ? `${BASE_URL}/docs_rules/${id}`
        : `${BASE_URL}/docs_rules/`;

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      setFormData({
        name: "",
        text: "",
        status: "active",
      });
      navigate("/documentation/create-update-documentation");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentationId) => {
    try {
      await deleteDocumentation(documentationId);
      navigate("/documentation");
    } catch (error) {
      console.error("Не удалось удалить вопрос", error);
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Создание / редактирование документа
      </div>
      <div className="card card-grid h-full min-w-full pb-4">
        <div className="card-header">
          <h3 className="card-title">Документ</h3>
        </div>
        <div className="flex flex-col px-4 gap-4 mt-4">
          <InputField
            text="Название"
            value={formData.name}
            onChange={handleChange("name")}
            className="textarea textarea-bordered"
            isInvalid={errors.name}
          />
          {/* <Textarea
            text="Содержание"
            value={formData.text}
            onChange={handleChange("text")}
            height={300}
            className="textarea textarea-bordered"
            isInvalid={errors.text}
          /> */}
          <div className="relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Содержание
            </label>
            <TextArea
              value={formData.text}
              onChange={handleChange("text")}
              style={{ height: "300px", resize: "none" }}
              status={errors.text ? "error" : ""}
            />
          </div>
          <Select
            isStatus={true}
            text="Статус"
            value={formData.status}
            onChange={handleChange("status")}
            options={[
              { label: "Активен", value: "active" },
              { label: "Остановлен", value: "inactive" },
            ]}
          />
        </div>
      </div>
      <div className="lg:flex-row flex flex-col gap-4 pt-4 justify-between">
        <button
          className="lg:w-1/4 py-2 flex justify-center btn btn-outline btn-danger"
          onClick={() => handleDelete(id)}
        >
          Удалить
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={() => navigate("/documentation")}
        >
          Отмена
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-outline btn-primary"
          onClick={handleSaveAndAddMore}
        >
          Сохранить и добавить еще
        </button>
        <button
          className="lg:w-1/4 flex justify-center btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};
