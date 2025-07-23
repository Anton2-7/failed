import { Fragment } from "react";
import { GiveawaysContent } from "./blocks/giveawayContent/GiveawaysContent";
import { useLayout } from "@/providers";

export function Giveaways() {
  const { currentLayout } = useLayout();
  return (
    <Fragment>
      {currentLayout?.name === "demo1-layout" && <div></div>}
      <div>
        <GiveawaysContent />
      </div>
    </Fragment>
  );
}
