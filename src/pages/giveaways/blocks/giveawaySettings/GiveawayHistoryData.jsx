import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getGiveawayHistoryData = async ({
  page,
  per_page,
  order_by,
  order_direction,
  giveaway_id,
}) => {
  const { data } = await axios.get(`${BASE_URL}/giveaways/history`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
    },
    params: {
      page,
      per_page,
      order_by,
      order_direction,
      giveaway_id,
    },
  });
  return data;
};

// export const getGiveawayHistoryData = async () => {
//   return {
//     total_items: 2,
//     total_pages: 1,
//     per_page: 10,
//     current_page: 1,
//     items: [
//       {
//         id: 1,
//         start_date: "2025-05-01T00:00:00Z",
//         end_date: "2025-05-10T00:00:00Z",
//         number: 1001,
//         status: "Завершен",
//         participants_count: 10,
//         price: 50,
//         spent_tickets: 120,
//         winners: [
//           {
//             id: 101,
//             email: null,
//             phone: "+78005553535",
//             tg_id: "user123",
//             vk_id: "vkuser1",
//             prize_id: 1,
//             prize_name: "AirPods",
//           },
//         ],
//       },
//       {
//         id: 2,
//         start_date: "2025-04-15T00:00:00Z",
//         end_date: "2025-04-22T00:00:00Z",
//         number: 1002,
//         status: "Завершен",
//         participants_count: 5,
//         price: 20,
//         spent_tickets: 60,
//         winners: [
//           {
//             id: 102,
//             email: null,
//             phone: null,
//             tg_id: "winner_telegram",
//             vk_id: null,
//             prize_id: 2,
//             prize_name: "Промокод на скидку",
//           },
//         ],
//       },
//       {
//         id: 3,
//         start_date: "2025-04-15T00:00:00Z",
//         end_date: "2025-04-22T00:00:00Z",
//         number: 1002,
//         status: "Завершен",
//         participants_count: 5,
//         price: 20,
//         spent_tickets: 60,
//         winners: [
//           {
//             id: 102,
//             email: null,
//             phone: null,
//             tg_id: null,
//             vk_id: "123456",
//             prize_id: 2,
//             prize_name: "Промокод на скидку",
//           },
//         ],
//       },
//       {
//         id: 4,
//         start_date: "2025-04-15T00:00:00Z",
//         end_date: "2025-04-22T00:00:00Z",
//         number: 1002,
//         status: "Завершен",
//         participants_count: 5,
//         price: 20,
//         spent_tickets: 60,
//         winners: [
//           {
//             id: 102,
//             email: "winner2@example.com",
//             phone: "+9876543210",
//             tg_id: "winner_telegram",
//             vk_id: null,
//             prize_id: 2,
//             prize_name: "Промокод на скидку",
//           },
//         ],
//       },
//     ],
//   };
// };
