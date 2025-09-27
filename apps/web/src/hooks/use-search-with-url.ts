import { useState, useEffect, startTransition } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useDebounce } from "./use-debounce";

export function useSearchWithURL() {
  const navigate = useNavigate({ from: '/explore' });
  const { q: urlQuery } = useSearch({ from:'/explore' });

  // Initialize from URL only once
  const [input, setInput] = useState(urlQuery);
  const debouncedInput = useDebounce(input, 400);

  // One-way sync: Input → URL only
  useEffect(() => {
    startTransition(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        q: debouncedInput,
      }),
      replace: true,
    });
  });
  }, [debouncedInput, navigate]);

  return {
    input,
    setInput,
    query: debouncedInput,
    isPending: input !== debouncedInput,
  };
}
