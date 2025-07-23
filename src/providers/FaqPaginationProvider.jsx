import React, { createContext, useContext, useState } from "react";

const FaqPaginationContext = createContext();

export const useFaqPagination = () => useContext(FaqPaginationContext);

export const FaqPaginationProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <FaqPaginationContext.Provider
      value={{
        activePage,
        setActivePage,
        totalPages,
        setTotalPages,
      }}
    >
      {children}
    </FaqPaginationContext.Provider>
  );
};
