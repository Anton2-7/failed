import axios from "axios";
import { BASE_URL } from "../../../../static";

export const getGiveawayData = async({page,per_page,order_by,order_direction})=> {
  const response = await axios.get(`${BASE_URL}/giveaways/`,{
    headers:{
      Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    },
    params:{
      page,
      per_page,
      order_by,
      order_direction,
    }
  })
  return response.data
}
