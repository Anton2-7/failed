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
import { TasksContent } from "./blocks/tasksContent/TasksContent";

export const TasksPage = () => {
  const { currentLayout } = useLayout();
  console.log(currentLayout);

  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}

      <div>
        <TasksContent />
      </div>
    </Fragment>
  );
};
