import axios from "axios";
import { BASE_URL } from "../../../static";

export const setParticipantPrize = async (requestData) => {
  const { data } = await axios.post(
    `${BASE_URL}/giveaways/participants/winner`,
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
