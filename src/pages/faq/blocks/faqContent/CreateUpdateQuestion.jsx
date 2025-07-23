import React, { useState, useEffect } from "react";
import { Select } from "../../../../components/select/select";
import { useNavigate, useParams, useLocation } from "react-router";
import axios from "axios";
import { deleteFaq } from "./FaqData";
import { Textarea } from "../../../../components/textarea/textarea";
import { BASE_URL } from "../../../../static";
import { InputField } from "../../../../components/inputField/inputField";
import { toast, Bounce } from "react-toastify";
import { Input } from "antd";
const { TextArea } = Input;
// import ReactQuill from "react-quill";
// import 'react-quill/dist/quill.snow.css';

export const CreateUpdateQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  const faqItem = location.state?.faqItem;

  useEffect(() => {
    if (faqItem) {
      setFormData({
        question: faqItem.question,
        answer: faqItem.answer,
        status: faqItem.status,
      });
    } else if (id) {
      axios
        .get(`${BASE_URL}/faq/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        })
        .then((res) => {
          const { question, answer, status } = res.data;
          setFormData({ question, answer, status });
        })
        .catch((err) => console.error("Ошибка загрузки вопроса", err));
    }
  }, [id, faqItem]);

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
    question: false,
    answer: false,
  });

  const validateForm = () => {
    const newErrors = {
      question: !formData.question,
      answer: !formData.answer,
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
      const url = id ? `${BASE_URL}/faq/${id}` : `${BASE_URL}/faq/`;

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      navigate("/faq");
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
      const url = id ? `${BASE_URL}/faq/${id}` : `${BASE_URL}/faq/`;

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      setFormData({
        question: "",
        answer: "",
        status: "active",
      });
      navigate("/faq/create-update-question");
    } catch (e) {
      console.error("Ошибка при сохранении:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId) => {
    try {
      await deleteFaq(faqId);
      navigate("/faq");
    } catch (error) {
      console.error("Не удалось удалить вопрос", error);
    }
  };

  return (
    <div className="px-6">
      <div className="text-2xl lg:text-3xl font-bold leading-none text-gray-900 pb-4">
        Создание / редактирование вопроса
      </div>
      <div className="card card-grid h-full min-w-full pb-4">
        <div className="card-header">
          <h3 className="card-title">Вопрос</h3>
        </div>
        <div className="min-[1024px]:flex px-4 gap-4 mt-4">
          <div className="w-full flex flex-col gap-4">
            {/* <Textarea
              text="Вопрос"
              value={formData.question}
              onChange={handleChange("question")}
              // height={326}
              className="textarea textarea-bordered"
            /> */}
            <InputField
              text="Вопрос"
              value={formData.question}
              onChange={handleChange("question")}
              // height={326}
              className="input"
              isInvalid={errors.question}
            />
            {/* <Textarea
              text="Ответ"
              value={formData.answer}
              onChange={handleChange("answer")}
              height={382}
              className="input"
              isInvalid={errors.answer}
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
                Ответ
              </label>
              <TextArea
                value={formData.answer}
                onChange={handleChange("answer")}
                style={{ height: "382px", resize: "none" }}
                status={errors.answer ? "error" : ""}
              />
            </div>
            <Select
              isStatus={true}
              text="Статус"
              value={formData.status}
              onChange={handleChange("status")}
              options={[
                { label: "Активен", value: "active" },
                { label: "Отключен", value: "inactive" },
              ]}
            />
          </div>
          {/* <div className="lg:w-1/2">
            <ReactQuill
              theme="snow"
              value={formData.answer}
              onChange={handleChange("answer")}
              modules={{ toolbar: false }}
              placeholder="Введите текст с форматированием..."
            />
          </div> */}
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
          onClick={() => navigate("/faq")}
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
