import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Check if running in browser environment
  const isBrowser =
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  // Initialize state with a function to avoid repeated parsing
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
   
        return initialValue;
      }
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Memoized function to set value in localStorage and state
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (!isBrowser) {
        console.warn(
          `Cannot set localStorage key "${key}": localStorage not available`
        );
        return;
      }

      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Validate that value is JSON-serializable
        try {
          JSON.stringify(valueToStore);
        } catch (error) {
          console.error(
            `Value for key "${key}" is not JSON-serializable:`,
            valueToStore,
            error
          );
          return;
        }

        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`Stored in localStorage for key "${key}":`, valueToStore);

        // Dispatch a storage event to sync across tabs
        const storageEvent = new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(valueToStore),
        });
        window.dispatchEvent(storageEvent);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          console.warn(`LocalStorage quota exceeded for key "${key}"`);
        }
      }
    },
    [key, storedValue, isBrowser]
  );

  // Sync state with storage changes from other tabs
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key || event.newValue === null) return;

      try {
        const newValue = JSON.parse(event.newValue);
        console.log(`Storage event detected for key "${key}":`, newValue);
        setStoredValue(newValue);
      } catch (error) {
        console.error(`Error parsing storage event for key "${key}":`, error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, isBrowser]);

  return [storedValue, setValue] as const;
}
