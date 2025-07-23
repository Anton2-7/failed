import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getFaqData = async ({page, filterOptions,per_page}) => {
  try {
    const response = await axios.get(`${BASE_URL}/faq/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      params: {
        page: page,
        per_page,
        ...filterOptions,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const swapFaqPosition = async (firstId, secondId) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/faq/swap`,
      {
        first_faq_id: firstId,
        second_faq_id: secondId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при смене позиции:", error);
    throw error;
  }
};

export const deleteFaq = async (faqId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/faq/${faqId}`, {
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
