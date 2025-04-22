import { useState, useEffect } from "react";

// This is the React Hook version - use this in components
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  const [value, setValue] = useState<T>(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  // Update local storage when the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Save state to localStorage
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Error writing to localStorage", error);
      }
    }
  }, [key, value]);

  return [value, setValue] as const;
}

// Regular function versions for non-component usage
export function setLocalStorage(key: string, value: any): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }
}

export function getLocalStorage<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return initialValue;
  }
}

export function removeLocalStorage(key: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  }
}