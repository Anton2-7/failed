import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getMailingTestData = async ({ params }) => {
  const { data } = await axios.get(`${BASE_URL}/campaigns/`, {
    params,
  });
  return data;
};
