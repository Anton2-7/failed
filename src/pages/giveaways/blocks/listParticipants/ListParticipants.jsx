import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router";
import { usePagination } from "@/providers/PaginationContext";
import {
  getGiveawayPrizes,
  getListParticipantsData,
} from "../../utils/getListParticipantsData";
import { DataGrid, Input, KeenIcon } from "../../../../components";
import useListParticipantsColumns from "../../hooks/useListParticipantsColumns";
import { setParticipantPrize } from "../../utils/setParticipantPrize";
import { deleteParticipantPrize } from "../../utils/deleteParticipantPrize";
import { showAlert } from "../../utils/showAlert";

export function ListParticipants() {
  const location = useLocation();
  const { id } = useParams();
  const { start_date, end_date } = location.state || {};
  const { activePage, setActivePage, setTotalPages, totalPages } =
    usePagination();
  const [prizes, setPrizes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [selectedPrize, setSelectedPrize] = useState("");
  const [size, setSize] = useState(10);
  const [participants, setParticipants] = useState([]);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  const { columns } = useListParticipantsColumns({
    prizes,
    onGiftClick: (user_id, index) => {
      setEditingParticipant(user_id); // логика назначения приза
      setEditingRowIndex(index); // UI: показать селект только в этой строке
      if (prizes.length > 0) {
        setSelectedPrize(String(prizes[0].id)); // важно: приводи к строке, если value — строка
      }
    },
    editingRowIndex,
    editingParticipant,
    selectedPrize,
    setSelectedPrize,
    onAssignPrize: handleAssignPrize,
    onDeleteClick: handleDeletePrize,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedValue =
        typeof inputValue === "string" ? inputValue.trim() : "";

      // Удаляем только один ведущий "@"
      const cleanedValue = trimmedValue.startsWith("@")
        ? trimmedValue.slice(1)
        : trimmedValue;

      setSearchTerm(cleanedValue);
      setActivePage(0);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setActivePage]);

  const fetchParticipantsPage = useCallback(
    async ({ pageIndex, pageSize, filters }) => {
      if (!id) return { data: [], totalCount: 0 };

      const params = {
        start_date,
        end_date,
        page: pageIndex + 1,
        per_page: pageSize,
        ...filters,
      };

      const participantsData = await getListParticipantsData({ id, params });

      setTotalPages(participantsData.total_pages);
      setSize(participantsData.per_page);
      const itemsWithIndex = participantsData.items.map((item, index) => ({
        ...item,
        _rowIndex: index,
      }));
      setParticipants(
        participantsData.items.map((item, index) => ({
          ...item,
          _rowIndex: index,
        }))
      );
      return {
        data: itemsWithIndex,
        totalCount: participantsData.total_items,
      };
    },
    [id, start_date, end_date, setTotalPages]
  );

  useEffect(() => {
    if (id) {
      getGiveawayPrizes(id).then((prizesData) => {
        setPrizes(prizesData.items);
      });
    }
  }, [id]);

  async function handleDeletePrize(participantId) {
    const participant = participants.find((p) => p.user_id === participantId);
    if (!participant) return;

    const requestData = {
      giveaway_id: parseInt(id),
      winner_id: participant.user_id,
      prize_id: participant.prize_id,
    };

    // Добавляем start_date и end_date, если они доступны
    if (start_date) {
      requestData.start_date = start_date;
    }
    if (end_date) {
      requestData.end_date = end_date;
    }

    try {
      const response = await deleteParticipantPrize(requestData);

      if (response.detail === "success") {
        showAlert("success", "Приз удалён");
        setForceUpdateKey((prev) => prev + 1);
        // Обнови таблицу
        fetchParticipantsPage({
          pageIndex: activePage || 0,
          pageSize: size,
          filters: { search_value: searchTerm },
        });
        setEditingParticipant(null);
        setEditingRowIndex(null);
      }
    } catch (error) {
      console.error("Ошибка при удалении приза:", error);
      showAlert("error", "Ошибка при удалении приза");
    }
  }

  async function handleAssignPrize() {
    if (!selectedPrize) {
      setEditingParticipant(null);
      return;
    }

    try {
      const requestData = {
        giveaway_id: parseInt(id),
        winner_id: editingParticipant,
        prize_id: parseInt(selectedPrize),
      };

      // Добавляем start_date и end_date, если они доступны
      if (start_date) {
        requestData.start_date = start_date;
      }
      if (end_date) {
        requestData.end_date = end_date;
      }

      const response = await setParticipantPrize(requestData);

      if (response.detail === "success") {
        showAlert("success", "Приз назначен");
        setForceUpdateKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Ошибка при назначении приза:", error);
      showAlert("error", "Ошибка при назначении приза");
    } finally {
      setEditingParticipant(null);
      setSelectedPrize("");
    }
  }

  return (
    <div className="px-6 items-center">
      <div className="text-2xl font-bold leading-none text-gray-900 pb-4">
        Список участников
      </div>
      <div className="card card-grid h-full min-w-full">
        <div className="card-header flex flex-wrap justify-between gap-2 ">
          <h3 className="card-title flex-shrink-0">Список участников</h3>
          <div className="relative flex-grow min-w-[240px] max-w-full xs:max-w-[calc(100%-16px)] sm:max-w-[50%]">
            <Input
              text="Найти пользователя"
              value={inputValue}
              onChange={(e) => setInputValue(e)}
              className="w-full"
            />
            <span className="absolute top-[25%] right-[3%] text-gray-400">
              <KeenIcon icon={"magnifier"} />
            </span>
          </div>
        </div>
        <div className="card-body">
          <DataGrid
            key={`search_params_${searchTerm}_update_${forceUpdateKey}`}
            columns={columns}
            serverSide={true}
            pagination={{
              size,
              page: activePage || 0,
              pageCount: totalPages || 1,
              onPageChange: setActivePage,
            }}
            onFetchData={fetchParticipantsPage}
            filters={{
              search_value: searchTerm,
            }}
            rowSelect={true}
          />
        </div>
      </div>
    </div>
  );
}
