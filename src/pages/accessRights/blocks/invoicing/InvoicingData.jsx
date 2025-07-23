import axios from "axios";
import { BASE_URL } from "../../../../static";
import { AccessContext } from "@/providers/AccessProvider";

export const getAdminsList = async ({ params }) => {
  try {
    const response = await axios.get(`${BASE_URL}/admins/`, {
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

export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/admins/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
    });

    showAlert("success", "Пользователь успешно удален.");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
