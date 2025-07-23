import axios from "axios";
import React, { createContext, useState } from "react";
import { BASE_URL } from "../static";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modals, setModals] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(() => () => {});

  const openModal = (modalId, userId, typeTable) => {
    console.log("modalId", modalId, "userId", userId);

    setModals((prev) => ({
      ...prev,
      [modalId]: true,
    }));
    if (userId) {
      if (typeTable === "users") {
        updateDataModal(userId);
      }
      if (typeTable === "admins") {
        updateDataAdminModal(userId);
      }
    }
  };

  const closeModal = (modalId) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: false,
    }));
  };
  const isModalOpen = (modalId) => !!modals[modalId];

  const updateDataModal = async (user_id) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      console.log(response.data, "MODAL");

      setSelectedRowData({
        ...response.data,
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateDataAdminModal = async (user_id) => {
    try {
      const response = await axios.get(`${BASE_URL}/admins/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        params: {
          page: 1,
          per_page: 1000,
        },
      });

      setSelectedRowData({
        ...response.data.items.find((item) => item.id === user_id),
        type: "admins",
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  // const openModal = (userID) => {
  //   updateDataModal(userID);
  //   // setSelectedRowData(rowData);
  //   console.log("rowData", userID);

  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <ModalContext.Provider
      value={{
        selectedRowData,
        modals,
        isModalOpen,
        updateDataModal,
        openModal,
        closeModal,
        setModals,
        refreshTrigger,
        setRefreshTrigger,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
