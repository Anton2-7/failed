import { useLocation } from "react-router";
import GiveawayHistory from "./GiveawayHistory";
import { GiveawayUpdate } from "./GiveawayUpdate";
import { useEffect } from "react";

export function SettingsGiveaway() {
  return (
    <div className="px-6">
      <div className="text-2xl font-bold leading-none text-gray-900 pb-4">
        Настройки конкурса
      </div>
      <div className="flex flex-col gap-7">
        <GiveawayUpdate />
        <GiveawayHistory />
      </div>
    </div>
  );
}
