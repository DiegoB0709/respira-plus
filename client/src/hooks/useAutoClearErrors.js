import { useEffect } from "react";

export const useAutoClearErrors = (errors, setErrors, delay = 3000) => {
  useEffect(() => {
    if (Array.isArray(errors) && errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), delay);
      return () => clearTimeout(timer);
    }
  }, [errors, setErrors, delay]);
};
