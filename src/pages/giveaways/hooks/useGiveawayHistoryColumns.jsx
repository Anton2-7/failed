import { useMemo } from "react";
import { StatusColorGiveaway } from "../blocks/giveawaySettings/StatusColorGiveaway";
import { KeenIcon } from "../../../components";
import { BASE_URL } from "../../../static";
import axios from "axios";
import GiveawayHistoryTooltip from "../blocks/giveawaySettings/GiveawayHistoryTooltip";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export function maskContact(value) {
  if (!value) return "";

  if (value.includes("@")) {
    // Email
    const [user, domain] = value.split("@");
    if (!user || !domain) return "***";
    const maskedUser = user[0] + "*".repeat(user.length - 1);
    const dotIndex = domain.lastIndexOf(".");
    if (dotIndex === -1) return maskedUser + "@***";
    const maskedDomain = "*".repeat(dotIndex) + domain.slice(dotIndex);
    return `${maskedUser}@${maskedDomain}`;
  }

  // Универсальная маска телефона
  const digits = value.replace(/\D/g, "");
  const hasPlus = value.trim().startsWith("+");

  if (digits.length >= 5) {
    const visibleFirst = digits[0];
    const visibleLast = digits[digits.length - 1];
    const maskedMiddle = "*".repeat(Math.max(digits.length - 2, 0));
    const masked = `${visibleFirst}${maskedMiddle}${visibleLast}`;
    return hasPlus ? "+" + masked : masked;
  }

  // tg_id / vk_id / fallback
  return value.length <= 2
    ? value[0] + "*"
    : value[0] + "*".repeat(value.length - 2) + value[value.length - 1];
}

export default function useGiveawayHistoryColumns({ hideWinners = false }) {
  const navigate = useNavigate();

  const handleDownloadReport = async (giveaway) => {
    const { id, start_date, end_date } = giveaway;
    const params = new URLSearchParams();
    if (start_date !== null) params.append("start_date", start_date);
    if (end_date !== null) params.append("end_date", end_date);
    try {
      const response = await axios.get(
        `${BASE_URL}/giveaways/participants/report/${id}?${params.toString()}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при скачивании отчета:", error);
    }
  };

  const handleWinnerClick = (winner) => {
    if (winner.email) {
      navigate(`/users?email=${encodeURIComponent(winner.email)}`);
    } else if (winner.tg_id) {
      navigate(`/users?tg_id=${encodeURIComponent(winner.tg_id)}`);
    } else if (winner.vk_id) {
      navigate(`/users?vk_id=${encodeURIComponent(winner.vk_id)}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => row.end_date,
        id: "end_date",
        header: () => "Дата провед.",
        enableSorting: true,
        cell: (info) => {
          const formattedDate = new Date(
            info.row.original.end_date
          ).toLocaleDateString("ru-RU");
          return (
            <div className="min-w-[110px]">
              {info.row.original.end_date === null
                ? "Не определена"
                : formattedDate}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.number,
        id: "number",
        header: () => "Номер конкурса",
        cell: (info) => (
          <div className="min-w-[110px]">{info.row.original.number}</div>
        ),
      },
      {
        accessorFn: (row) => row.status,
        id: "status",
        header: () => "Статус",
        cell: (info) => {
          const { status } = info.row.original;
          return (
            <div className="flex items-center">
              <StatusColorGiveaway status={status} />
              {status}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.participants_count,
        id: "participants_count",
        header: () => "Участников",
        cell: (info) => <div>{info.row.original.participants_count}</div>,
        meta: {
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.price,
        id: "price",
        header: () => "Стоимость",
        cell: (info) => <div>{info.row.original.price}</div>,
        meta: {
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.spent_tickets,
        id: "spent_tickets",
        header: () => "Билетов собрано",
        cell: (info) => {
          if (!info.row.original.spent_tickets) return;
          return <div>{info.row.original.spent_tickets}</div>;
        },
        meta: {
          cellClassName: "text-gray-800 font-normal",
        },
      },
      {
        accessorFn: (row) => row.winners,
        id: "winners",
        header: () => "Победители",
        cell: (info) => {
          const { winners, status, ...rest } = info.row.original;

          // if (!winners || winners.length === 0) return <div>—</div>;
          if (status !== "Завершен") return <div></div>;

          const getWinnerContact = (winner) => {
            if (winner.email) return winner.email;
            if (winner.phone) return winner.phone;
            if (winner.tg_id) return winner.tg_id;
            if (winner.vk_id) return winner.vk_id;
            return "";
          };

          const winnersText = winners
            .map((w) => {
              const contact = getWinnerContact(w);
              const displayContact = hideWinners
                ? maskContact(contact)
                : contact;
              return `${displayContact} — ${w.prize_name}`;
            })
            .join(", ");

          return (
            <div className="flex justify-between gap-2 min-w-[800px] items-center">
              <div
                className="overflow-hidden whitespace-nowrap text-ellipsis text-sm text-gray-800"
                style={{
                  maxWidth: "calc(100% - 160px)",
                }}
              >
                {winners.map((winner, index) => {
                  const contact = getWinnerContact(winner);
                  const displayContact = hideWinners
                    ? maskContact(contact)
                    : contact;

                  return (
                    <span
                      key={index}
                      className="mr-4 truncate"
                      title={`${displayContact} — ${winner.prize_name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWinnerClick(winner);
                      }}
                    >
                      <span className="text-primary cursor-pointer">
                        {displayContact}
                      </span>
                      {" — "}
                      {winner.prize_name}
                      {index < winners.length - 1 ? "," : ""}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <button className="ki-filled text-[x-large] text-primary">
                  <Link
                    to={`/giveaways/participants/${info.row.original.id}`}
                    state={{
                      start_date: info.row.original.start_date,
                      end_date: info.row.original.end_date,
                      hideSensitive: hideWinners,
                    }}
                  >
                    <KeenIcon icon={"gift"} />
                  </Link>
                </button>
                <button
                  onClick={() => handleDownloadReport(rest)}
                  className="ki-filled text-[x-large] text-primary"
                >
                  <KeenIcon icon={"file-down"} />
                </button>
                <GiveawayHistoryTooltip winners={winners} />
              </div>
            </div>
          );
        },
      },
    ],
    [hideWinners]
  );

  return { columns };
}
