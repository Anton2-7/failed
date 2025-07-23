import React, { useContext, useEffect, useState } from "react";
import { Select, InputNumber } from "antd";
import { KeenIcon } from "../../components/keenicons";
import { FilterContext } from "../../providers/FilterProvider";
import axios from "axios";
import { BASE_URL } from "../../static";
import { useLocation } from "react-router-dom";

const FilterTabel = () => {
  const {
    filterOptions,
    addFilter,
    removeFilter,
    updateUserList,
    clearFilters,
  } = useContext(FilterContext);

  const [searchKey, setSearchKey] = useState(""); // дефолтное значение — 'Все'
  const [prevSearchKey, setPrevSearchKey] = useState(null);

  const [search, setSearch] = useState("");
  const [valueMin, setValueMin] = useState(null);
  const [valueMax, setValueMax] = useState(null);

  const [giveawaysData, setGiveawaysData] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [gamesportStatus, setGamesportStatus] = useState(null);
  const [giveawayValue, setGiveawayValue] = useState(null);

  const location = useLocation();

  useEffect(() => {
    clearFilters();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchKeys = ["email", "tg_id", "vk_id", "id"]; // добавляем id

    for (const key of searchKeys) {
      const value = params.get(key);
      if (value) {
        setSearchKey(key);
        setSearch(value);
        addFilter(key, value);
        updateUserList();
        break;
      }
    }
  }, []);

  useEffect(() => {
    const getGiveaways = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/info/giveaways`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        });
        setGiveawaysData(response.data);
        console.log("getGiveaways", response.data);
      } catch (error) {
        console.error("Error fetching giveaways:", error);
      }
    };
    getGiveaways();
  }, []);

  const handleFilterOption = () => {
    // Удаляем все возможные фильтры по ID/email
    ["email", "tg_id", "vk_id", "id"].forEach((key) => removeFilter(key));

    // Если выбран не 'Все' и поле не пустое — добавляем фильтр
    if (searchKey && search.trim() !== "") {
      let cleanedSearch = search.trim();

      // Если ищем по Telegram ID — удаляем @ перед отправкой
      if (searchKey === "tg_id" && cleanedSearch.startsWith("@")) {
        cleanedSearch = cleanedSearch.slice(1);
      }

      addFilter(searchKey, cleanedSearch);
    }

    if (valueMin !== null && valueMin !== undefined && valueMin !== "") {
      addFilter("min_balance", valueMin);
    } else {
      removeFilter("min_balance");
    }

    if (valueMax !== null && valueMax !== undefined && valueMax !== "") {
      addFilter("max_balance", valueMax);
    } else {
      removeFilter("max_balance");
    }

    // Просто обновляем список (updateUserList сам отправит дефолтный запрос, если нет фильтров)
    updateUserList();
  };

  const searchOptions = [
    { label: "Все", value: "" },
    { label: "ID", value: "id" },
    { label: "Telegram", value: "tg_id" },
    { label: "Email", value: "email" },
    { label: "Vk", value: "vk_id" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFilterOption();
      }}
      className="mb-4"
    >
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col lg:flex-row gap-4 w-full">
          <div className="input w-full lg:w-1/2">
            <i className="ki-outline ki-magnifier"></i>
            <input
              type="text"
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFilterOption();
                }
              }}
            />
          </div>
          <div className="flex gap-4 w-full flex-col lg:flex-row lg:w-1/2">
            <div className="w-full relative">
              <label
                style={{
                  color: "#99A1B7",
                  fontSize: "11px",
                  display: "inline",
                  marginBottom: "0px",
                }}
                className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
              >
                Искать по параметрам
              </label>
              <Select
                className="input ps-0 pe-0 border-none"
                options={searchOptions}
                value={searchKey}
                onChange={(value) => {
                  setPrevSearchKey(searchKey); // запоминаем старое значение
                  setSearchKey(value); // обновляем новое значение
                }}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="relative w-full">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  Билетов от
                </label>
                <InputNumber
                  size="large"
                  className="rounded-md text-sm w-full"
                  min={0}
                  value={valueMin}
                  onChange={(value) => setValueMin(value)}
                  onPressEnter={handleFilterOption}
                  controls={false}
                />
              </div>
              <div className="relative w-full">
                <label
                  style={{
                    color: "#99A1B7",
                    fontSize: "11px",
                    display: "inline",
                    marginBottom: "0px",
                  }}
                  className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
                >
                  До
                </label>
                <InputNumber
                  size="large"
                  className="rounded-md text-sm w-full"
                  min={0}
                  value={valueMax}
                  onChange={(value) => setValueMax(value)}
                  onPressEnter={handleFilterOption}
                  controls={false}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-xl opacity-90">
                  <KeenIcon icon="question-2" />
                </div>
                <button type="submit" className="btn btn-outline btn-primary">
                  Искать
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="flex flex-row w-1/2 pr-0 lg:pr-2 gap-4 w-full lg:w-1/2">
          <div className="w-full lg:w-1/2 relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Конкурс
            </label>
            <Select
              value={giveawayValue}
              placeholder="Все"
              className="input ps-0 pe-0 border-none"
              options={[
                { label: "Все", value: null },
                ...giveawaysData.map((g) => ({
                  label: g.name || `ID ${g.id}`,
                  value: g.id,
                })),
              ]}
              onChange={(value) => {
                setGiveawayValue(value);
                setSubscriptionType(null);
                setGamesportStatus(null);

                removeFilter("gs_subscription"); // очищаем оба
                removeFilter("giveaway_id");

                if (value !== null) {
                  addFilter("giveaway_id", value);
                }
              }}

              // allowClear
            />
          </div>

          {/* <div className="w-full lg:w-1/3 relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Тип подписки
            </label>
            <Select
              value={subscriptionType}
              placeholder="Все"
              className="input ps-0 pe-0 border-none"
              options={[
                { label: "Все", value: null },
                { label: "Все подписки", value: "FULL" },
                { label: "Lite подписка", value: "LITE" },
                { label: "Pro подписка", value: "PRO" },
                { label: "Без подписки", value: "UNSUBSCRIBED" },
              ]}
              onChange={(value) => {
                setSubscriptionType(value);
                setGamesportStatus(null);
                setGiveawayValue(null);

                removeFilter("gs_subscription");
                removeFilter("giveaway_id");

                if (value !== null) {
                  addFilter("gs_subscription", value);
                }
              }}

              // allowClear
            />
          </div> */}

          <div className="w-full lg:w-1/2 relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Подписка GameSport
            </label>
            <Select
              value={gamesportStatus}
              placeholder="Все"
              className="input ps-0 pe-0 border-none"
              options={[
                { label: "Все", value: null },
                { label: "Все подписки", value: "FULL" },
                { label: "Lite подписка", value: "LITE" },
                { label: "Pro подписка", value: "PRO" },
                { label: "Без подписки", value: "UNSUBSCRIBED" },
              ]}
              onChange={(value) => {
                setGamesportStatus(value);
                setSubscriptionType(null);
                setGiveawayValue(null);

                removeFilter("gs_subscription");
                removeFilter("giveaway_id");

                if (value !== null) {
                  addFilter("gs_subscription", value);
                }
              }}

              // allowClear
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export { FilterTabel };
