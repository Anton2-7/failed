export const DashboardInfoContainer = ({ children, title }) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-1">
      <h2 className="text-[#252F4A] font-semibold">{title}</h2>
      {/* max-w-[772px] */}
      <div className="w-full card card-grid py-3">
        <div className="flex gap-[20px] 2xl:gap-[40px] items-start lg:items-center min-[660px]:justify-center px-5 lg:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};
