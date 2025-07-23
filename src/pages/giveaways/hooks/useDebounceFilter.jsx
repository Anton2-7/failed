import { useEffect, useState } from "react";

export default function useDebounceFilter(items, searchTerm, delay = 300) {
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setFilteredItems(items);
      } else {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = items.filter(
          (item) =>
            item.tg_id?.toString().toLowerCase().includes(lowerSearch) ||
            item.email?.toString().toLowerCase().includes(lowerSearch) ||
            item.vk_id?.toString().toLowerCase().includes(lowerSearch) ||
            item.id?.toString().toLowerCase().includes(lowerSearch)
        );
        setFilteredItems(filtered);
      }
    },delay);

    return ()=> clearTimeout(handler)
  }, [searchTerm, items, delay]);

  return  filteredItems ;
}
