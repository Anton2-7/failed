import { KeenIcon } from "../../../../components";
import { getPhotoSrc } from "../../utils/getPhotoSrc";

export function PrizeCard({
  prize,
  onDeletePrize,
  onEditingPrize,
  onMoveLeft,
  onMoveRight,
}) {
  if (!prize) return null;

  const photoSrc = getPhotoSrc(prize.photo);

  return (
    <div className="w-full max-w-[144px] h-[184px] bg-[#0C192D] rounded-xl flex flex-col items-center justify-center gap-2 shadow-lg sm:w-[144px] sm:flex-shrink-0 max-[350px]:h-[160px]">
      <div className="w-[calc(100%-32px)] aspect-square max-h-[112px] max-w-[112px] flex items-center justify-center max-[350px]:w-[calc(100%-24px)]">
        <img
          src={photoSrc}
          alt={prize.name}
          className="object-cover rounded-lg w-full h-full border-2 border-[#1E2A47]"
        />
      </div>
      <div className="flex justify-between w-full px-2 gap-2">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center max-[350px]:w-8 max-[350px]:h-8"
          onClick={() => onMoveLeft(prize.position)}
        >
          <KeenIcon
            icon="left-square"
            className="text-[26px] text-gray-500 max-[350px]:text-[22px]"
          />
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center max-[350px]:w-8 max-[350px]:h-8"
          onClick={() => onMoveRight(prize.position)}
        >
          <KeenIcon
            icon="right-square"
            className="text-[26px] text-gray-500 max-[350px]:text-[22px]"
          />
        </button>
        <button
          type="button"
          onClick={() => onEditingPrize(prize)}
          className="w-10 h-10 flex items-center justify-center text-gray-500 max-[350px]:w-8 max-[350px]:h-8"
        >
          <KeenIcon
            icon="notepad-edit"
            className="text-[26px] max-[350px]:text-[22px]"
          />
        </button>
        <button
          type="button"
          onClick={() => onDeletePrize(prize.position)}
          className="w-10 h-10 flex items-center justify-center text-gray-500 max-[350px]:w-8 max-[350px]:h-8"
        >
          <KeenIcon
            icon="trash-square"
            className="text-[26px] max-[350px]:text-[22px]"
          />
        </button>
      </div>
    </div>
  );
}
