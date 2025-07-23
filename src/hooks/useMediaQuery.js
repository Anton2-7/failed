import { useEffect, useState } from 'react';
const getMatches = query => {
  // Prevents SSR issues
  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches;
  }
  return false;
};
const useMediaQuery = query => {
  const [matches, setMatches] = useState(getMatches(query));
  useEffect(() => {
    function handleChange() {
      setMatches(getMatches(query));
    }
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();
    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);
  return matches;
};
export { useMediaQuery };