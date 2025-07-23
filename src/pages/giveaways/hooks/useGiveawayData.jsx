import { useEffect, useState } from "react";
import { formatDateForInput } from "../../../utils/FormatDateForInput";
import axios from "axios";
import { BASE_URL } from "../../../static";

const INITIAL_INPUT_STATE = {
  name: "",
  id: "",
  active: "",
  start_date: "",
  price: "",
  period_days: "",
};

export function useGiveawayData(id) {
  const [errors, setErrors] = useState({
    name: false,
    start_date: false,
    price: false,
  });

  const [inputs, setInputs] = useState(INITIAL_INPUT_STATE);
  const [prizes, setPrizes] = useState([]);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const fetchGiveaway = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/giveaways/${id}`);
      const {
        name,
        id: giveawayId,
        active,
        price,
        period_days,
        start_date,
        prizes,
      } = res.data;
      const status = typeof active === "boolean" ? active : active === "Идет";
      setInputs({
        name,
        id: giveawayId,
        active: status,
        price,
        period_days,
        start_date: formatDateForInput(start_date),
      });
      setPrizes(prizes || []);
    } catch (err) {
      console.error("Ошибка загрузки конкурса", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGiveaway(id);
    } else {
      setInputs({
        name: "",
        id: "",
        active: "",
        start_date: "",
        price: "",
        period_days: "",
      });
      setPrizes([]);
    }
  }, [id]);

  const onChangeHandler = (field) => (e) => {
    let value = e?.target ? e.target.value : e;

    // Обработка period_days
    if (field === "period_days") {
      value = value === "" || value === null ? 0 : value;
    }

    // Обработка active — убедимся, что это boolean
    if (field === "active") {
      value = Boolean(value);
    }

    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return {
    inputs,
    prizes,
    setPrizes,
    onChangeHandler,
    fetchGiveaway,
    errors,
    setErrors,
    setWasSubmitted,
    wasSubmitted,
  };
}
