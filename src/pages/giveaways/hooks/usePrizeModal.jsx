import { useState } from "react";

export function usePrizeModal() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [editingPrize, setEditingPrize] = useState(null);
  
    const openModal = () => setIsOpenModal(true);
    const closeModal = () => {
      setIsOpenModal(false);
      setEditingPrize(null);
    };

    const handleEditPrize = (prize) => {
      setEditingPrize(prize);
      setIsOpenModal(true);
    };
    return {isOpenModal,editingPrize,openModal,closeModal,handleEditPrize}
}
