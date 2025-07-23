import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getMailingData = async ({ params }) => {
  try {
    const response = await axios.get(`${BASE_URL}/campaigns/`, {
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

export const deleteMailing = async (mailingId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/campaigns/${mailingId}`, {
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
