import { useState, useEffect } from 'react';

// Хук для работы с localStorage
export const useLocalStorage = (key, initialValue) => {
  // Получаем значение из localStorage или используем начальное значение
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для обновления значения
  const setValue = (value) => {
    try {
      // Позволяем value быть функцией, как useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем состояние
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
