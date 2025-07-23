import axios from "axios";
import { BASE_URL } from "../../../static";

export const getListParticipantsData = async ({ id, params }) => {
  const { data } = await axios.get(
    `${BASE_URL}/giveaways/participants/${id}?search_params_arr=vk_id&search_params_arr=id&search_params_arr=email&search_params_arr=tg_id`,
    {
      params,
    }
  );
  return data;
};

export const getGiveawayPrizes = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/giveaways/prizes/${id}`);
  return data;
};

// export const getListParticipantsData = async ({ id, params }) => {
//   return {
//     total_items: 3,
//     total_pages: 1,
//     per_page: 10,
//     current_page: 1,
//     items: [
//       {
//         id: 1,
//         email: "user1@example.com",
//         phone: "+79001112233",
//         tg_id: "user_telegram1",
//         vk_id: "vk_user_1",
//         prize_id: 0,
//         prize_name: "Промокод",
//       },
//       {
//         id: 2,
//         email: "user2@example.com",
//         phone: "+79004445566",
//         tg_id: "user_telegram2",
//         vk_id: "vk_user_2",
//         prize_id: 2,
//         prize_name: "Наушники JBL",
//       },
//       {
//         id: 3,
//         email: "user3@example.com",
//         phone: "+79007778899",
//         tg_id: "user_telegram3",
//         vk_id: "vk_user_3",
//         prize_id: 0,
//         prize_name: "Подарочная карта",
//       },
//     ],
//   };
// };

// export const getGiveawayPrizes = async (id) => {
//   return {
//     items: [
//       { id: 1, name: "Промокод" },
//       { id: 2, name: "Наушники JBL" },
//       { id: 3, name: "iPhone" },
//     ],
//   };
// };
