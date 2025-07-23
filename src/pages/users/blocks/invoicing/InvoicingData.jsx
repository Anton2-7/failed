import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getUsersData = async ({ params }) => {
  console.log("token", localStorage.getItem("admin_token"));
  try {
    const response = await axios.get(`${BASE_URL}/users/`, {
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
