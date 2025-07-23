import { Popover, Switch } from "antd";
import { useState, useEffect } from "react";
import { KeenIcon } from "../../../components";

export const MetricsSettingsPopover = ({ visibleMetrics, onSave, metrics }) => {
  const [open, setOpen] = useState(false);
  const [tempState, setTempState] = useState({});
  const allOn = Object.values(tempState).every(Boolean);

  useEffect(() => {
    const init = {};
    metrics.forEach((m) => {
      init[m.id] = visibleMetrics.includes(m.id);
    });
    setTempState(init);
  }, [visibleMetrics, metrics]);

  const handleToggle = (id) => {
    setTempState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = () => {
    const updated = {};
    metrics.forEach((m) => {
      updated[m.id] = !allOn;
    });
    setTempState(updated);
  };

  const handleSave = () => {
    const selected = Object.entries(tempState)
      .filter(([_, val]) => val)
      .map(([id]) => id);
    onSave(selected);
    setOpen(false);
  };

  const content = (
    <div className="w-[300px]">
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <span className="font-bold">Настройки отображения</span>
        <div className="flex gap-2">
          <span className="font-medium text-sm">Все</span>
          <Switch checked={allOn} onChange={handleToggleAll} />
        </div>
      </div>
      <div className="space-y-3 max-h-[250px] overflow-y-auto mb-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <span>{metric.label}</span>
            <Switch
              checked={tempState[metric.id]}
              onChange={() => handleToggle(metric.id)}
            />
          </div>
        ))}
      </div>
      <button
        className="w-full py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Сохранить
      </button>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={(v) => setOpen(v)}
      placement="bottomLeft"
    >
      <button className="w-1/2 lg:w-auto btn btn-light flex text-[#4B5675] font-medium gap-2">
        <KeenIcon icon="setting-2" />
        Метрики
      </button>
    </Popover>
  );
};
