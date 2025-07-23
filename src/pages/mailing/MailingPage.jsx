import { Fragment } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";
import { useLayout } from "@/providers";
import { MailingContent } from "./blocks/MailingContent/MailingContent";

export const MailingPage = () => {
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <MailingContent />
      </div>
    </Fragment>
  );
};
