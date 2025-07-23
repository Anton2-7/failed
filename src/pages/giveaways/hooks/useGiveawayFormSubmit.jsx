// import { useNavigate } from "react-router";
// import { BASE_URL } from "../../../static";
// import axios from "axios";
// import { showAlert } from "../utils/showAlert";

// export function useGiveawayFormSubmit(inputs, prizes, id, fetchGiveaway) {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (prizes.length < 3) {
//       showAlert("error", "Нужно минимум 3 приза");
//       return;
//     }

//     const formData = new FormData();

//     // Добавляем основные данные формы
//     Object.entries(inputs).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (key === "start_date") {
//           let val = value;
//           if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
//             val = val + " 00:00:00";
//           }
//           formData.append(key, val);
//         } else {
//           formData.append(key, value);
//         }
//       }
//     });

//     // Подготовка данных о призах
//     const prizesDataObj = {
//       prizes: [],
//     };

//     // Обработка изображений призов
//     for (const prize of prizes) {
//       if (!prize.photo) {
//         prizesDataObj.prizes.push({
//           id: prize.id,
//           name: prize.name,
//           position: prize.position,
//           photo: null,
//         });
//         continue;
//       }

//       try {
//         let photoFile;
//         let filename;

//         if (prize.photo.startsWith("data:")) {
//           // Обработка новых фото (base64)
//           const response = await axios.get(prize.photo, {
//             responseType: "blob",
//           });
//           photoFile = response.data;
//           filename = `prize_${prize.position}.webp`; // фиксированное расширение
//         } else {
//           // Обработка существующих фото (URL)
//           const imageUrl = prize.photo.startsWith("http")
//             ? prize.photo
//             : `http://${prize.photo}`;

//           const response = await axios.get(imageUrl, { responseType: "blob" });
//           photoFile = response.data;
//           filename = `existing_prize_${prize.position}.webp`;
//         }

//         // Добавляем файл в FormData
//         formData.append("prizes_photos", photoFile, filename);

//         // Добавляем информацию о призе
//         prizesDataObj.prizes.push({
//           id: prize.id,
//           name: prize.name,
//           position: prize.position,
//           photo: filename,
//         });
//       } catch (error) {
//         console.error("Error processing prize photo:", error);
//         prizesDataObj.prizes.push({
//           id: prize.id,
//           name: prize.name,
//           position: prize.position,
//           photo: null,
//         });
//       }
//     }

//     // Добавляем данные о призах как JSON
//     formData.append("prizes_data", JSON.stringify(prizesDataObj));

//     try {
//       const method = id ? "PATCH" : "POST";
//       const url = id
//         ? `${BASE_URL}/giveaways/${id}`
//         : `${BASE_URL}/giveaways/giveaway`;

//       const response = await axios({
//         method,
//         url,
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 200 && method === "POST") {
//         showAlert("success", "Конкурс успешно создан!");
//       }
//       if (response.status === 200 && method === "PATCH") {
//         showAlert("success", "Конкурс успешно обновлен!");
//       }

//       if (!id) {
//         navigate(`/giveaways/settings-giveaway/${response.data.id}`);
//       } else {
//         fetchGiveaway(id);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       showAlert("error", error.message);
//     }
//   };

//   return { handleSubmit };
// }

import { useNavigate } from "react-router";
import { BASE_URL } from "../../../static";
import axios from "axios";
import { showAlert } from "../utils/showAlert";

export function useGiveawayFormSubmit(
  inputs,
  prizes,
  id,
  fetchGiveaway,
  setErrors,
  setWasSubmitted
) {
  console.log(inputs);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {
      name: !inputs.name,
      start_date: !inputs.start_date,
      price: inputs.price === null || inputs.price === undefined,
    };

    setErrors(newErrors);

    if (prizes.length < 3) {
      showAlert("error", "Добавьте минимум 3 приза");
      return false;
    }

    if (!inputs.name) {
      showAlert("error", "Введите название конкурса");
      return;
    }
    if (!inputs.start_date) {
      showAlert("error", "Введите дату начала конкурса");
      return;
    }
    // if (!inputs.period_days) {
    //   showAlert("error", "Введите периодичность конкурса");
    //   return;
    // }
    if (!inputs.price) {
      showAlert("error", "Введите стоимость конкурса");
      return;
    }
    if (prizes.length < 3) {
      showAlert("error", "Нужно минимум 3 приза");
      return;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setWasSubmitted(true); // <--- добавь это

    if (!validateForm()) return;

    const formData = new FormData();

    // Основные поля конкурса
    Object.entries(inputs).forEach(([key, value]) => {
      if (key === "period_days") {
        const safeValue = value === "" || value == null ? 0 : value;
        formData.append(key, safeValue);
      } else if (key === "start_date") {
        let val = value;
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          val += " 00:00:00";
        }
        formData.append(key, val);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Подготовка JSON и файлов
    const prizesDataObj = {
      prizes: [],
    };

    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      const filename = `prize_${i + 1}.webp`;

      try {
        const response = await fetch(prize.photo);
        const blob = await response.blob();
        formData.append("prizes_photos", blob, filename);

        prizesDataObj.prizes.push({
          id: prize.id ?? null,
          name: prize.name,
          position: i + 1,
          photo: filename,
        });
      } catch (err) {
        console.error("Ошибка загрузки изображения:", err);
        showAlert("error", "Ошибка при подготовке изображений призов");
        return;
      }
    }

    formData.append("prizes_data", JSON.stringify(prizesDataObj));

    try {
      const method = id ? "PATCH" : "POST";
      const url = id
        ? `${BASE_URL}/giveaways/${id}`
        : `${BASE_URL}/giveaways/giveaway`;

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const successMessage = id
        ? "Конкурс успешно обновлен!"
        : "Конкурс успешно создан!";
      showAlert("success", successMessage);

      if (!id) {
        navigate(`/giveaways/settings-giveaway/${response.data.id}`);
      } else {
        fetchGiveaway(id);
      }
    } catch (error) {
      console.error("Ошибка при сохранении конкурса:", error);
      showAlert("error", error.message);
    }
  };

  return { handleSubmit };
}

// import { useNavigate } from "react-router";
// import { BASE_URL } from "../../../static";
// import axios from "axios";
// import { showAlert } from "../utils/showAlert";

// export function useGiveawayFormSubmit(inputs, prizes, id, fetchGiveaway) {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (prizes.length < 3) {
//       showAlert("error", "Нужно минимум 3 приза");
//       return;
//     }

//     const formData = new FormData();

//     // Добавляем основные данные формы
//     Object.entries(inputs).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         if (key === "start_date") {
//           let val = value;
//           if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
//             val = val + " 00:00:00";
//           }
//           formData.append(key, val);
//         } else {
//           formData.append(key, value);
//         }
//       }
//     });

//     // Только позиции + прочие данные без загрузки фото
//     const prizesDataObj = {
//       prizes: prizes.map(({ id, name, position, photo }) => ({
//         id,
//         name,
//         position,
//         photo,
//       })),
//     };

//     formData.append("prizes_data", JSON.stringify(prizesDataObj));

//     try {
//       const method = id ? "PATCH" : "POST";
//       const url = id
//         ? `${BASE_URL}/giveaways/${id}`
//         : `${BASE_URL}/giveaways/giveaway`;

//       const response = await axios({
//         method,
//         url,
//         data: formData,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 200 && method === "POST") {
//         showAlert("success", "Конкурс успешно создан!");
//       }
//       if (response.status === 200 && method === "PATCH") {
//         showAlert("success", "Конкурс успешно обновлен!");
//       }

//       if (!id) {
//         navigate(`/giveaways/settings-giveaway/${response.data.id}`);
//       } else {
//         fetchGiveaway(id);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       showAlert("error", error.message);
//     }
//   };

//   return { handleSubmit };
// }
