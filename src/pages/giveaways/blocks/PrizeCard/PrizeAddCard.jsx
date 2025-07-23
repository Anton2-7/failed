export default function PrizeAddCard({ openModal }) {
  return (
    <div
      className="w-full max-w-[144px] h-[184px] bg-blue-50 border border-gray rounded-xl flex items-center justify-center cursor-pointer
                sm:w-[144px] sm:flex-shrink-0
                max-[350px]:h-[160px]"
      onClick={openModal}
    >
      <div
        className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center
                   max-[350px]:w-8 max-[350px]:h-8"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="max-[350px]:w-6 max-[350px]:h-6"
        >
          <line
            x1="16"
            y1="10"
            x2="16"
            y2="22"
            stroke="#97A3B9"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="10"
            y1="16"
            x2="22"
            y2="16"
            stroke="#97A3B9"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
