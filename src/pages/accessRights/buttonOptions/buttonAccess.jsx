import { useContext } from "react";
import { ModalContext } from "@/providers/ModalProvider";

const ButtonAccess = () => {
  const { openModal } = useContext(ModalContext);
  return (
    <div className="w-full flex justify-between lg:justify-end lg:gap-2.5">
      <button
        className="btn-md lg:btn-lg btn btn-primary justify-center"
        onClick={() => {
          openModal("editRole");
        }}
      >
        Редактировать роль
      </button>
      <button
        className="btn-md lg:btn-lg btn btn-primary justify-center"
        onClick={() => {
          openModal("addUser");
        }}
      >
        Добавить пользователя
      </button>
    </div>
  );
};
export { ButtonAccess };
