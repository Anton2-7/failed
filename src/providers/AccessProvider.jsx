import React, { createContext, useState } from "react";
import { toast, Bounce } from "react-toastify";
import { usePagination } from "@/providers/PaginationContext";
import axios from "axios";
import { BASE_URL } from "../static";

export const AccessContext = createContext();

export const AccessProvider = ({ children }) => {
  const { setTotalPages } = usePagination();
  const [adminsList, setAdminsList] = useState(null);
  const [rolesProvider, setRolesProvider] = useState([]);
  const [permissions, setPermissions] = useState([]);
  console.log("permissions", permissions);
  console.log("rolesProvider", rolesProvider);
  console.log("adminsList", adminsList);

  const getAdminsList = async ({ params }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admins/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        params,
      });
      console.log("data");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admins/roles/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      console.log("getRoles", response.data);
      const data = { data: response.data, type: "roles" };
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const addNewRole = async (newRole) => {
    try {
      if (!newRole || typeof newRole !== "string" || newRole.trim() === "") {
        showAlert("error", "Название роли не может быть пустым.");
        // throw new Error("Название роли не может быть пустым.");
      }
      // if (permissions.length <= 0) {
      //   showAlert("error", "Доступы к разделам не могут быть пустыми.");
      //   throw new Error("Доступы к разделам не могут быть пустыми.");
      // }

      const response = await axios.post(
        `${BASE_URL}/admins/roles/role`,
        { name: newRole.trim(), permission_ids: permissions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      showAlert("success", "Роль успешно создана.");
      return await response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getPermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admins/roles/permissions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      console.log("getPermissions111111111111111111111111111", response.data);
      const data = { data: response.data, type: "permissions" };
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const patchRoles = async (nameRole, id) => {
    console.log("patchRoles", id, nameRole);

    try {
      console.log("patchRoles_permissions", permissions);

      if (permissions.length <= 0) {
        showAlert("error", "Доступы к разделам не могут быть пустыми.");
        throw new Error("Доступы к разделам не могут быть пустыми.");
      }
      const response = await axios.patch(
        `${BASE_URL}/admins/roles/${id}`,
        { name: nameRole, permission_ids: permissions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );
      console.log("patchRoles", response.data);
      showAlert("success", "Настройки роли успешно изменены.");
      await getAdminsList();
      return await response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const patchAdmin = async (objData, id) => {
    try {
      if (!objData.role_ids || objData.role_ids.length === 0) {
        showAlert("error", "Необходимо выбрать хотя бы одну роль");
        throw new Error("Необходимо выбрать хотя бы одну роль");
      }

      const response = await axios.patch(
        `${BASE_URL}/admins/admin/${id}`,
        objData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
        }
      );

      showAlert("success", "Данные пользователя успешно изменены.");
      await getAdminsList();
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении администратора:", error);
      // showAlert("error", error.response?.data?.message || "Произошла ошибка");
    }
  };

  const addNewAdmin = async (newAdmin) => {
    try {
      const response = await axios.post(`${BASE_URL}/admins/admin`, newAdmin, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });
      console.log("patchRoles", response.data);
      showAlert("success", "Пользователь успешно создан.");
      await getAdminsList();
      return await response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const showAlert = (type, message) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <AccessContext.Provider
      value={{
        adminsList,
        permissions,
        rolesProvider,
        setPermissions,
        setRolesProvider,
        getAdminsList,
        getRoles,
        addNewRole,
        getPermissions,
        patchRoles,
        patchAdmin,
        addNewAdmin,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
};
