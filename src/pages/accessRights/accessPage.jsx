import { Fragment, useContext, useEffect } from "react";
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from "@/partials/toolbar";
import { ModalSetingsRoles } from "./modalSetingsRoles/modalSetingsRoles";
import { ModalAddUser } from "./ModalAddUser/ModalAddUser";
import { useLayout } from "@/providers";
import { AccessContent } from "./AccessContent";
import { ButtonAccess } from "./buttonOptions/buttonAccess";

import { ModalContext } from "../../providers/ModalProvider";
import { ModalAdminsDetails } from "./adminsDetailsModal/adminsDetailsModal";

const AccessPage = () => {
  const { modals } = useContext(ModalContext);
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && (
        <div className="w-auto h-auto">
          {modals["editRole"] && <ModalSetingsRoles />}
          {modals["addUser"] && <ModalAddUser />}
          {modals["adminDetails"] && <ModalAdminsDetails />}
          <ToolbarHeading></ToolbarHeading>
        </div>
      )}

      <div>
        <div className="flex w-full justify-between items-start lg:items-center max-sm:flex-col gap-[16px] px-6">
          <h1 className="text-3xl font-bold leading-none text-gray-900">
            Доступы
          </h1>
          <ButtonAccess />
        </div>
        <AccessContent />
      </div>
    </Fragment>
  );
};

export { AccessPage };
