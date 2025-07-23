import { useNavigate } from "react-router";
import {
  KeenIcon,
  Menu,
  MenuArrow,
  MenuItem,
  MenuLink,
  MenuSub,
} from "../../../../components";

export default function GiveawayTooltip({ giveaway }) {
  const navigate = useNavigate();
  const menuGiveawayKeys = [
    "start_date",
    "participants_count",
    "spent_tickets",
    "winner_id",
  ];

  const translateKey = (key) => {
    const translations = {
      start_date: "Дата окончания",
      participants_count: "Количество участников",
      spent_tickets: "Потрачено билетов",
      winner_id: "ID победителя",
    };
    return translations[key] || key;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "0";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU");
    } catch {
      return "0";
    }
  };

  const handleWinnerClick = (winnerId, e) => {
    e.stopPropagation();
    if (winnerId) {
      navigate(`/users?id=${encodeURIComponent(winnerId)}`);
    }
  };

  const buildMenuToggle = () => {
    return (
      <MenuArrow>
        <KeenIcon
          icon="down"
          className="text-2xs text-gray-500 menu-item-active:text-primary menu-item-here:text-primary menu-item-show:text-primary menu-link-hover:text-primary"
        />
      </MenuArrow>
    );
  };

  const getValue = (key, value) => {
    if (key === "start_date") {
      return formatDate(value);
    }
    if (key === "winner_id") {
      return value || "Не определено";
    }
    return value !== undefined && value !== null ? value : "0";
  };

  return (
    <Menu highlight={true} className="relative">
      <MenuItem
        toggle="dropdown"
        trigger="click"
        className="text-sm border-b-2 border-b-transparent menu-item-active:border-b-primary menu-item-here:border-b-primary"
        dropdownProps={{
          placement: "bottom",
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, 0] },
            },
          ],
        }}
      >
        <MenuLink className="cursor-pointer">{buildMenuToggle()}</MenuLink>

        <MenuSub className="menu-default gap-0" rootClassName="min-w-[200px]">
          {menuGiveawayKeys.map((key, index) => (
            <MenuItem key={index} className="text-sm">
              <MenuLink className="!p-1">
                <div className="flex justify-between gap-[3px]">
                  <span className="font-medium text-gray-700">
                    {`${translateKey(key)}:`}
                  </span>
                  <span className="text-gray-900">
                    {key === "winner_id" ? (
                      giveaway[key] ? (
                        <span
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={(e) => handleWinnerClick(giveaway[key], e)}
                        >
                          {giveaway[key]}
                        </span>
                      ) : (
                        "Не определен"
                      )
                    ) : (
                      getValue(key, giveaway[key])
                    )}
                  </span>
                </div>
              </MenuLink>
            </MenuItem>
          ))}
        </MenuSub>
      </MenuItem>
    </Menu>
  );
}
