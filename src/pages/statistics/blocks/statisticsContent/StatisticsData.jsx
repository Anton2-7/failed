import axios from "axios";
import { BASE_URL } from "../../../../static";
import { getAuth } from "../../../../auth";

export const getStatisticsData = async ({ params }) => {
  const auth = getAuth();
  const token = auth?.token;
  try {
    const response = await axios.get(`${BASE_URL}/statistics/`, {
      headers: {
        Authorization: token,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// export const deleteTask = async (taskId) => {
//   try {
//     const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Ошибка при удалении вопроса:", error);
//     throw error;
//   }
// };
