"use client";

import { useState, useEffect } from "react";

type useDebounceProps = {
  delay: number; // in ms
};

export function useDebounce<T>({
  value,
  delay,
}: useDebounceProps & { value: T }) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
