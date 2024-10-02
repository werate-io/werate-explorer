// src/utils/useLocalState.ts

import { useState, useEffect } from 'react';

export function useLocalState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key', key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error setting localStorage key', key, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}
