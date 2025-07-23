import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#238CFA",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 11,
    backgroundColor: "#E4EAF2",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 200,
    }),
  },
}));
