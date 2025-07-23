const Toolbar = ({ children }) => {
  return (
    <div className="flex flex-wrap items-center lg:items-end justify-between gap-5 justify-center">
      {children}
    </div>
  );
};
export { Toolbar };
