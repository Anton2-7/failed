import { Input, Modal } from "../../../../components";
import ModalPrize from "../modalPrize/ModalPrize";
import PrizeAddCard from "../PrizeCard/PrizeAddCard";
import { PrizeCard } from "../PrizeCard/PrizeCard";
import { useParams } from "react-router";
import { useGiveawayFormSubmit } from "../../hooks/useGiveawayFormSubmit";
import { usePrizeModal } from "../../hooks/usePrizeModal";
import { useGiveawayData } from "../../hooks/useGiveawayData";
import { DatePicker, InputNumber, Select } from "antd";
import dayjs from "../../../dashboard/dayjsConfig";
import { FlexibleDateTimePicker } from "../../../../components/FlexibleDateTimePicker/FlexibleDateTimePicker";
import { useState } from "react";
import { SingleDateTimePicker } from "../../../dashboard/blocks/SingleDateTimePicker";

export function GiveawayUpdate() {
  const { id } = useParams();
  const {
    inputs,
    onChangeHandler,
    prizes,
    setPrizes,
    fetchGiveaway,
    errors,
    setErrors,
    setWasSubmitted,
    wasSubmitted,
  } = useGiveawayData(id);
  const { closeModal, editingPrize, handleEditPrize, isOpenModal, openModal } =
    usePrizeModal();
  const { handleSubmit } = useGiveawayFormSubmit(
    inputs,
    prizes,
    id,
    fetchGiveaway,
    setErrors,
    setWasSubmitted,
    wasSubmitted
  );

  const movePrizeLeft = (position) => {
    if (position <= 1) return;
    setPrizes((prev) => {
      const newPrizes = [...prev];
      const i = newPrizes.findIndex((p) => p.position === position);
      const j = newPrizes.findIndex((p) => p.position === position - 1);
      [newPrizes[i], newPrizes[j]] = [newPrizes[j], newPrizes[i]];
      return newPrizes.map((p, index) => ({
        ...p,
        position: index + 1,
      }));
    });
  };

  const movePrizeRight = (position) => {
    setPrizes((prev) => {
      const newPrizes = [...prev];
      const index = newPrizes.findIndex((p) => p.position === position);
      if (index === -1 || index === newPrizes.length - 1) return prev;

      [newPrizes[index], newPrizes[index + 1]] = [
        newPrizes[index + 1],
        newPrizes[index],
      ];

      return newPrizes.map((p, i) => ({
        ...p,
        position: i + 1,
      }));
    });
  };

  const onDeletePrize = (position) => {
    setPrizes((prev) => {
      const filtered = prev.filter((prize) => prize.position !== position);
      return filtered.map((prize, index) => ({
        ...prize,
        position: index + 1,
      }));
    });
  };

  const onSavePrize = (newPrize) => {
    if (editingPrize) {
      setPrizes((prev) =>
        prev.map((prize) =>
          prize.position === editingPrize.position
            ? { ...newPrize, position: prize.position }
            : prize
        )
      );
    } else {
      setPrizes((prev) => {
        const updated = [...prev, { ...newPrize, position: prev.length + 1 }];
        return updated;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card card-grid min-w-full h-full pb-4 flex flex-col">
        <div className="card-header">
          <h3 className="card-title">Конкурс</h3>
          <button type="submit" className="justify-center btn btn-primary">
            Сохранить
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-4 mt-4">
          <div className="flex flex-col">
            <Input
              text="Название конкурса"
              value={inputs.name}
              onChange={onChangeHandler("name")}
              isInvalid={wasSubmitted && errors.name}
            />
          </div>
          <div className="flex flex-col">
            <Input
              text="ID Конкурса"
              value={inputs.id}
              disabled={true}
              onChange={onChangeHandler("id")}
            />
          </div>
          <div className="flex flex-col relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Статус
            </label>
            <Select
              className="input ps-0 pe-0 border-none"
              // value={inputs.active}
              value={inputs.active}
              onChange={onChangeHandler("active")}
              options={[
                { label: "Активный", value: true },
                { label: "Приостановлен", value: false },
              ]}
            />
            {/* <Select
              text="Статус"
              value={inputs.active}
              onChange={onChangeHandler("active")}
              options={[
                { label: "Активный", value: true },
                { label: "Приостановлен", value: false },
              ]}
            /> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mb-4 ">
          <div className="hidden lg:block">
            <SingleDateTimePicker
              placeholder="Дата подведения итогов"
              withTime={false}
              value={inputs.start_date ? new Date(inputs.start_date) : null}
              onChange={(val) =>
                onChangeHandler("start_date")(
                  val ? dayjs(val).format("YYYY-MM-DD") : ""
                )
              }
              isInvalid={wasSubmitted && errors.start_date}
            />
          </div>
          <div className="flex flex-col relative block lg:hidden">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Дата запуска
            </label>
            {/* <div className="hidden lg:flex">
              <DatePicker
                placeholder=""
                className="input"
                format="DD.MM.YYYY"
                value={
                  inputs.start_date
                    ? dayjs(inputs.start_date, "YYYY-MM-DD")
                    : null
                }
                onChange={(date) =>
                  onChangeHandler("start_date")(
                    date ? date.format("YYYY-MM-DD") : ""
                  )
                }
              />
            </div> */}
            <div className="block lg:hidden">
              <FlexibleDateTimePicker
                mode="single"
                withTime={false}
                value={
                  inputs.start_date
                    ? [dayjs(inputs.start_date, "YYYY-MM-DD")]
                    : []
                }
                onChange={(dateArr) => {
                  const selected = dateArr?.[0];
                  onChangeHandler("start_date")(
                    selected ? selected.format("YYYY-MM-DD") : ""
                  );
                }}
              />
            </div>

            {/* <Input
              text="Дата запуска"
              typeInput="date"
              value={inputs.start_date}
              onChange={onChangeHandler("start_date")}
            /> */}
          </div>
          <div className="relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Периодичность (в днях)
            </label>
            <InputNumber
              size="large"
              className="rounded-md text-sm w-full"
              min={0}
              value={inputs.period_days}
              onChange={(value) => onChangeHandler("period_days")(value)}
              controls={false}
            />
          </div>
          {/* <div className="flex flex-col">
            <Input
              text="Периодичность (в днях)"
              typeInput="number"
              value={inputs.period_days}
              onChange={onChangeHandler("period_days")}
            />
          </div> */}
          <div className="relative">
            <label
              style={{
                color: "#99A1B7",
                fontSize: "11px",
                display: "inline",
                marginBottom: "0px",
              }}
              className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
            >
              Стоимость
            </label>

            <InputNumber
              size="large"
              className="rounded-md text-sm w-full"
              min={0}
              value={inputs.price}
              onChange={onChangeHandler("price")}
              controls={false}
              status={wasSubmitted && inputs.price === "" ? "error" : ""}
            />
          </div>
          {/* <div className="flex flex-col">
            <Input
              text="Стоимость"
              typeInput="number"
              value={inputs.price}
              onChange={onChangeHandler("price")}
            />
          </div> */}
        </div>
        <div className="grid px-4">
          <label className="text-[13px] text-gray-500">
            Призы (добавьте минимум три)
          </label>
          <div className="max-w-full scrollable-x-auto mt-2">
            <div
              className="grid grid-cols-2 gap-4 pb-3 overflow-x-hidden
                  sm:flex sm:flex-nowrap sm:overflow-x-auto sm:scrollable-x-auto"
            >
              {prizes.length > 0 &&
                prizes.map((prize, index) => (
                  <PrizeCard
                    key={`${prize.position}_${index}`}
                    prize={prize}
                    onEditingPrize={handleEditPrize}
                    onDeletePrize={onDeletePrize}
                    onMoveLeft={movePrizeLeft}
                    onMoveRight={movePrizeRight}
                  />
                ))}
              <PrizeAddCard openModal={openModal} />
            </div>
          </div>
        </div>
      </div>

      <Modal open={isOpenModal} onClose={closeModal}>
        <ModalPrize
          closeModal={closeModal}
          onSavePrize={onSavePrize}
          prizes={prizes}
          editingPrize={editingPrize}
        />
      </Modal>
    </form>
  );
}
