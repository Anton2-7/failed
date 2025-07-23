import axios from "axios";
import { BASE_URL } from "../../../static";

export const deleteParticipantPrize = async (requestData) => {
  const { data } = await axios.delete(
    `${BASE_URL}/giveaways/participants/winner`,
    {
      data: requestData,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
