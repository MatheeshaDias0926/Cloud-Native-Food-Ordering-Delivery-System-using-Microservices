import { useState, useCallback } from "react";
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePincode,
} from "../utils/helpers";

const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      for (const rule of rules) {
        if (rule.required && !value) {
          return rule.message || "This field is required";
        }

        if (rule.email && !validateEmail(value)) {
          return rule.message || "Please enter a valid email address";
        }

        if (rule.phone && !validatePhone(value)) {
          return rule.message || "Please enter a valid phone number";
        }

        if (rule.password && !validatePassword(value)) {
          return (
            rule.message ||
            "Password must be at least 8 characters long and contain both letters and numbers"
          );
        }

        if (rule.pincode && !validatePincode(value)) {
          return rule.message || "Please enter a valid pincode";
        }

        if (rule.min && value.length < rule.min) {
          return rule.message || `Minimum ${rule.min} characters required`;
        }

        if (rule.max && value.length > rule.max) {
          return rule.message || `Maximum ${rule.max} characters allowed`;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message || "Invalid format";
        }

        if (rule.validate && typeof rule.validate === "function") {
          const error = rule.validate(value);
          if (error) return error;
        }
      }

      return "";
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      if (touched[name]) {
        const error = validateField(name, fieldValue);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [values, validateField]
  );

  const setFieldValue = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules, validateField]);

  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm]
  );

  const getFieldProps = useCallback(
    (name) => ({
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      error: touched[name] && !!errors[name],
      helperText: touched[name] && errors[name],
    }),
    [values, touched, errors, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validateForm,
    getFieldProps,
  };
};

export default useForm;
