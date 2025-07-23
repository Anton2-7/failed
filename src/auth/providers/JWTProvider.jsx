/* eslint-disable no-unused-vars */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import * as authHelper from "../_helpers";
const API_URL = import.meta.env.VITE_APP_API_URL;
const API_URL_TEST = import.meta.env.VITE_APP_API_URL_TEST;
// export const LOGIN_URL = `${API_URL}/login`;
export const LOGIN_URL = `${API_URL_TEST}/auth`;
export const REGISTER_URL = `${API_URL}/register`;
export const FORGOT_PASSWORD_URL = `${API_URL}/forgot-password`;
export const RESET_PASSWORD_URL = `${API_URL}/reset-password`;
// export const GET_USER_URL = `${API_URL}/user`;
export const GET_USER_URL = `/api/dashboard`;

const sectionRedirectMap = {
  Сводка: "/summary",
  Дашборды: "/dashboard",
  Статистика: "/statistics",
  Пользователи: "/users",
  Конкурсы: "/giveaways",
  Задания: "/tasks",
  FAQ: "/faq",
  "Документы и правила": "/documentation",
  Рассылки: "/mailing",
  Доступы: "/access",
};

const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState();
  const verify = async () => {
    if (auth) {
      try {
        const { data: user } = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };
  useEffect(() => {
    verify().finally(() => {
      setLoading(false);
    });
  }, []);
  const saveAuth = (auth) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };
  // const login = async (email, password) => {
  //   try {
  //     const { data: auth } = await axios.post(LOGIN_URL, {
  //       email,
  //       password,
  //     });
  //     saveAuth(auth);
  //     const { data: user } = await getUser();
  //     setCurrentUser(user);
  //   } catch (error) {
  //     saveAuth(undefined);
  //     throw new Error(`Error ${error}`);
  //   }
  // };
  const login = async (email, password) => {
    try {
      const response = await axios.post(LOGIN_URL, {
        login: email,
        password,
      });

      const token = response.headers["authorization"];
      const admin = response.data?.admin;

      if (!token || !admin?.id) {
        throw new Error("Invalid auth response");
      }

      const authData = {
        token,
        adminId: admin.id,
      };

      saveAuth(authData);

      // 🚀 Запрашиваем /admins/me
      const { data } = await axios.get(`${API_URL_TEST}/admins/me`, {
        headers: { Authorization: token },
      });

      const permissions = data.permissions || [];
      const firstSection = permissions[0]?.name;
      console.log(permissions, "Доступные разделы");

      const redirectPath = sectionRedirectMap[firstSection] || "/dashboard";

      setCurrentUser({ id: admin.id });

      return redirectPath; // 👈 возвращаем путь вызывающему компоненту
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const register = async (email, password, password_confirmation) => {
    try {
      const { data: auth } = await axios.post(REGISTER_URL, {
        email,
        password,
        password_confirmation,
      });
      saveAuth(auth);
      const { data: user } = await getUser();
      setCurrentUser(user);
    } catch (error) {
      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };
  const requestPasswordResetLink = async (email) => {
    await axios.post(FORGOT_PASSWORD_URL, {
      email,
    });
  };
  const changePassword = async (
    email,
    token,
    password,
    password_confirmation
  ) => {
    await axios.post(RESET_PASSWORD_URL, {
      email,
      token,
      password,
      password_confirmation,
    });
  };
  const getUser = async () => {
    return await axios.get(GET_USER_URL);
  };
  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestPasswordResetLink,
        changePassword,
        getUser,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };
