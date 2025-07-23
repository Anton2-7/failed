import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getTasksData = async ({ params }) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении вопроса:", error);
    throw error;
  }
};

export const swapTasksPosition = async (firstId, secondId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/tasks/swap`,
      {
        first_task_id: firstId,
        second_task_id: secondId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене позиции задания:", error);
    throw error;
  }
};
