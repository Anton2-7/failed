import { useEffect, useMemo } from "react";
import { KeenIcon, Select } from "../../../components";
import { NativeSelect } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { maskContact } from "./useGiveawayHistoryColumns";

export default function useListParticipantsColumns({
  prizes,
  onGiftClick,
  onDeleteClick,
  editingParticipant,
  selectedPrize,
  setSelectedPrize,
  onAssignPrize,
  editingRowIndex,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const hideSensitive = location.state?.hideSensitive ?? false;

  useEffect(() => {
    console.log(hideSensitive, "HHH");
  }, [hideSensitive]);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";

    const digits = phone.replace(/\D/g, ""); // оставить только цифры
    if (digits.length !== 11) return phone;

    return `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  };

  const handleWinnerClick = (email) => {
    if (email) {
      navigate(`/users?email=${encodeURIComponent(email)}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.id,
        id: "id",
        header: () => "Номер участия",
        cell: (info) => <div className="">{info.row.original.id}</div>,
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[150px] lg:min-w-[250px]"
              : " min-w-[150px] lg:min-w-[250px]",
        },
      },
      {
        accessorFn: (row) => row.tg_id,
        id: "tg_id",
        header: () => "Telegram",
        cell: (info) => {
          const { tg_id, tg_username } = info.row.original;
          if (tg_username) {
            return (
              <div className="">
                @{hideSensitive ? maskContact(tg_username) : tg_username}
              </div>
            );
          }
          if (tg_id) {
            return (
              <div className="">
                id{hideSensitive ? maskContact(tg_id) : tg_id}
              </div>
            );
          }
          return <div>-</div>;
        },
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[150px] lg:min-w-[250px]"
              : " min-w-[150px] lg:min-w-[250px]",
        },
      },
      {
        accessorFn: (row) => row.vk_id,
        id: "vk_id",
        header: () => "VK",
        cell: (info) => {
          return info.row.original.vk_id ? (
            <div className=" flex gap-2 items-center">
              <span className="text-md ki-filled ki-exit-right-corner text-[#99A1B7]" />
              <span>
                id
                {hideSensitive
                  ? maskContact(info.row.original.vk_id)
                  : info.row.original.vk_id}
              </span>
            </div>
          ) : (
            <div>-</div>
          );
        },
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[150px] lg:min-w-[250px]"
              : " min-w-[150px] lg:min-w-[250px]",
        },
      },
      {
        accessorFn: (row) => row.phone,
        id: "phone",
        header: () => "Телефон",
        cell: (info) => {
          const rawPhone = info.row.original.phone;
          const formatted = formatPhoneNumber(rawPhone);
          return info.row.original.phone ? (
            <div className=" flex gap-2 items-center">
              <span className="text-md ki-filled ki-phone text-[#99A1B7]" />
              <span>{hideSensitive ? maskContact(rawPhone) : formatted}</span>
            </div>
          ) : (
            <div>-</div>
          );
        },
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[150px] lg:min-w-[250px]"
              : " min-w-[150px] lg:min-w-[250px]",
        },
      },
      {
        accessorFn: (row) => row.email,
        id: "email",
        header: () => "Email",
        cell: (info) => {
          const { email } = info.row.original;
          return (
            <div className=" flex items-center gap-2">
              <span className="text-md ki-filled ki-sms text-[#99A1B7]" />
              {/* <KeenIcon icon={"sms"} /> */}
              <span className="text-primary">
                {email ? (
                  <span
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWinnerClick(email);
                    }}
                  >
                    {hideSensitive ? maskContact(email) : email}
                  </span>
                ) : (
                  <span>-</span>
                )}
              </span>
            </div>
          );
        },
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[150px] lg:min-w-[250px]"
              : " min-w-[150px] lg:min-w-[250px]",
        },
      },
      {
        accessorFn: (row) => row.assignPrize,
        id: "assignPrize",
        header: () => "Назначить приз",
        cell: (info) => {
          const { prize_id, prize_name, user_id, _rowIndex } =
            info.row.original;
          const prizeOptions = prizes.map((prize) => ({
            value: prize.id,
            label: prize.name,
          }));
          console.log(_rowIndex);

          if (prize_id) {
            return (
              <div className=" flex items-center justify-center font-bold gap-4">
                <span>{prize_name}</span>
                <button
                  onClick={() => onDeleteClick(user_id)}
                  className="ki-filled text-[x-large] text-danger"
                >
                  <KeenIcon icon={"trash"} />
                </button>
              </div>
            );
          }

          // Предположим, что ты итерируешься по строкам: .map((row, index) => ...)
          if (editingRowIndex === _rowIndex) {
            return (
              <div className=" flex gap-2">
                <div className="w-full h-10">
                  <Select
                    text={"Приз"}
                    value={selectedPrize}
                    onChange={(e) => setSelectedPrize(e.target.value)}
                    options={prizeOptions}
                    className="w-full h-10 text-base px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <button
                  onClick={onAssignPrize}
                  className="bg-primary text-white rounded-md px-[12px] flex justify-center items-center"
                >
                  <KeenIcon icon="check-circle" className="text-[16.5px]" />
                </button>
              </div>
            );
          }

          return (
            <div className=" flex justify-center items-center">
              <button
                onClick={() => onGiftClick(user_id, _rowIndex)}
                className="ki-filled text-[x-large] text-primary"
              >
                <KeenIcon icon={"gift"} />
              </button>
            </div>
          );
        },
        meta: {
          cellClassName: (row) =>
            row.prize_id
              ? "bg-green-50 min-w-[250px] lg:min-w-[250px]"
              : " min-w-[250px] lg:min-w-[250px]",
        },
      },
    ],
    [prizes, editingParticipant, selectedPrize, onDeleteClick]
  );
  return { columns };
}
