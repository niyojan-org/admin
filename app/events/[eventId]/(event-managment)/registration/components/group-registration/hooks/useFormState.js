/**
 * Custom hooks for group registration form
 */

import { useState, useRef } from "react";

export function useFieldErrors() {
  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const setErrors = (errors) => {
    setFieldErrors(errors);
  };

  const clearAllErrors = () => {
    setFieldErrors({});
  };

  return { fieldErrors, clearFieldError, setErrors, clearAllErrors };
}

export function useFieldRefs() {
  const fieldRefs = useRef({});

  const scrollToField = (fieldKey) => {
    if (fieldRefs.current[fieldKey]) {
      setTimeout(() => {
        fieldRefs.current[fieldKey].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
    }
  };

  return { fieldRefs, scrollToField };
}
