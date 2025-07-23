// PaginationContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => console.log(totalPages), [totalPages]);

  return (
    <PaginationContext.Provider
      value={{ activePage, setActivePage, totalPages, setTotalPages }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  return useContext(PaginationContext);
};
