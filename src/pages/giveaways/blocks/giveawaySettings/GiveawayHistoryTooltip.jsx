import { useNavigate } from "react-router";
import {
  KeenIcon,
  Menu,
  MenuArrow,
  MenuItem,
  MenuLink,
  MenuSub,
} from "../../../../components";

export default function GiveawayHistoryTooltip({ winners }) {
  const navigate = useNavigate();

  const handleWinnerClick = (userId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId) {
      navigate("/users", { state: userId });
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

  const getWinnerContact = (winner) => {
    if (winner.email) {
      return { type: "Email", value: winner.email };
    } else if (winner.phone) {
      return { type: "Телефон", value: winner.phone };
    } else if (winner.tg_id) {
      return { type: "Telegram", value: winner.tg_id };
    } else if (winner.vk_id) {
      return { type: "VK", value: winner.vk_id };
    }
    return null;
  };

  return (
    <Menu highlight={true} className="relative">
      <MenuItem
        toggle="dropdown"
        trigger="click"
        className="text-sm border-b-2 border-b-transparent menu-item-active:border-b-primary menu-item-here:border-b-primary"
        dropdownProps={{
          placement: "bottom-end",
          modifiers: [
            {
              name: "offset",
              options: { offset: [15, 0] },
            },
          ],
        }}
      >
        <MenuLink className="cursor-pointer">{buildMenuToggle()}</MenuLink>

        <MenuSub className="menu-default gap-0" rootClassName="py-2">
          {winners.map((winner, index) => {
            const contact = getWinnerContact(winner);
            return (
              <MenuItem key={index} className="text-sm">
                <MenuLink className="!p-0">
                  <div className="flex items-center gap-1">
                    {contact && (
                      <>
                        <span
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={(e) => handleWinnerClick(winner.id, e)}
                        >
                          {contact.value}
                        </span>
                        <span>—</span>
                      </>
                    )}
                    <span className="text-gray-900">{winner.prize_name}</span>
                  </div>
                </MenuLink>
              </MenuItem>
            );
          })}
        </MenuSub>
      </MenuItem>
    </Menu>
  );
}
