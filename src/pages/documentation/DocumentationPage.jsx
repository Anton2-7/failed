import { Fragment } from "react";
import { Container } from "@/components/container";
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from "@/partials/toolbar";
import { DocumentationContent } from "./blocks/documentationContent/DocumentationContent";
import { useLayout } from "@/providers";

export const DocumentationPage = () => {
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <DocumentationContent />
      </div>
    </Fragment>
  );
};
