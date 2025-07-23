import { CommonHexagonBadge } from '@/partials/common';
const ProductInsight = ({
  image,
  title,
  description,
  number
}) => {
  return <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2.5">
          <CommonHexagonBadge stroke="stroke-gray-300" fill="fill-gray-100" size="size-[50px]" badge={image} />
          <div className="flex flex-col gap-0.5">
            <span className="leading-none font-medium text-base text-gray-900">{title}</span>
            <span className="text-2sm text-gray-700">{description}</span>
          </div>
        </div>

        <div className="font-semibold text-2xl text-gray-800">{number}</div>
      </div>
    </div>;
};
export { ProductInsight };