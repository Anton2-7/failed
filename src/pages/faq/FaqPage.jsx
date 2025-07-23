import { Fragment } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";
import { FaqContent } from "./blocks/faqContent/FaqContent";
import { useLayout } from "@/providers";

export const FaqPage = () => {
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <FaqContent />
      </div>
    </Fragment>
  );
};
