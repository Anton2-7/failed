import { Fragment, useContext } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";
import { ModalSetingsUser } from "./modalSetings/modsalSetings";
import { PageNavbar } from "@/pages/account";
import { UsersAccountHistoryContent } from ".";
import { useLayout } from "@/providers";
import { FilterTabel } from "./FilterTabel";
import { ModalContext } from "@/providers/ModalProvider";

const UsersPage = () => {
  const { modals } = useContext(ModalContext);
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {/* <PageNavbar /> */}
      {modals["userSettings"] && <ModalSetingsUser />}
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <UsersAccountHistoryContent />
      </div>
    </Fragment>
  );
};

export { UsersPage };
