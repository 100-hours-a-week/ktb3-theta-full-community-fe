import { useCallback, useRef, useState } from "react";

function validateField(value, rules = {}) {
  if (!rules) return null;
  const { required, minLength, maxLength, pattern, validate } = rules;

  if (required && !String(value ?? "").trim()) {
    return required.message || "필수 항목입니다.";
  }
  if (minLength && String(value ?? "").length < minLength.value) {
    return minLength.message || `최소 ${minLength.value}자 이상`;
  }
  if (maxLength && String(value ?? "").length > maxLength.value) {
    return maxLength.message || `최대 ${maxLength.value}자 이하`;
  }
  if (pattern && !pattern.value.test(String(value ?? ""))) {
    return pattern.message || "형식이 올바르지 않습니다.";
  }
  if (typeof validate === "function") {
    const res = validate(value);
    if (res !== true) return res || "유효하지 않습니다.";
  }
  return null;
}

export function useForm({ defaultValues = {} } = {}) {
  const valuesRef = useRef({ ...defaultValues });
  const rulesRef = useRef({});
  const inputsRef = useRef({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value, { shouldValidate = true } = {}) => {
    valuesRef.current[name] = value;
    if (shouldValidate) {
      const msg = validateField(value, rulesRef.current[name]);
      setErrors((prev) => ({ ...prev, [name]: msg }));
    }
  }, []);

  const getValues = useCallback(() => ({ ...valuesRef.current }), []);

  const reset = useCallback(
    (nextValues = defaultValues) => {
      valuesRef.current = { ...nextValues };
      setErrors({});
      Object.entries(inputsRef.current).forEach(([name, el]) => {
        if (!el) return;
        const v = nextValues[name];
        if (el.type === "checkbox") {
          el.checked = !!v;
        } else if (el.type === "radio") {
          el.checked = el.value === String(v ?? "");
        } else if (el.tagName === "SELECT" && el.multiple) {
          const set = new Set(Array.isArray(v) ? v.map(String) : []);
          Array.from(el.options).forEach((opt) => (opt.selected = set.has(opt.value)));
        } else if ("value" in el) {
          el.value = v ?? "";
        }
      });
    },
    [defaultValues]
  );

  const validateAll = useCallback(() => {
    const newErrors = {};
    for (const [name, rules] of Object.entries(rulesRef.current)) {
      const msg = validateField(valuesRef.current[name], rules);
      if (msg) newErrors[name] = msg;
    }
    setErrors(newErrors);
    return newErrors;
  }, []);

  const register = useCallback(
    (name, rules = {}) => {
      rulesRef.current[name] = rules;

      const refCallback = (el) => {
        if (!el) return;
        inputsRef.current[name] = el;
        const v = valuesRef.current[name];
        if (el.type === "checkbox") {
          el.checked = !!v;
        } else if (el.type === "radio") {
          el.checked = el.value === String(v ?? "");
        } else if (el.tagName === "SELECT" && el.multiple) {
          const set = new Set(Array.isArray(v) ? v.map(String) : []);
          Array.from(el.options).forEach((opt) => (opt.selected = set.has(opt.value)));
        } else if ("value" in el) {
          el.value = v ?? "";
        }
      };

      const onChange = (e) => {
        const t = e.target;
        let value;
        if (t.type === "checkbox") {
          value = t.checked;
        } else if (t.type === "radio") {
          value = t.value;
        } else if (t.tagName === "SELECT" && t.multiple) {
          value = Array.from(t.selectedOptions).map((o) => o.value);
        } else {
          value = t.value;
        }
        setValue(name, value, { shouldValidate: true });
      };

      const onBlur = () => {
        const v = valuesRef.current[name];
        const msg = validateField(v, rulesRef.current[name]);
        setErrors((prev) => ({ ...prev, [name]: msg }));
      };

      const init = valuesRef.current[name];
      const base = { name, ref: refCallback, onChange, onBlur };
      return {
        ...base,
        ...(init !== undefined && { defaultValue: init }),
        ...(typeof init === "boolean" && { defaultChecked: init }),
      };
    },
    [setValue]
  );

  const handleSubmit = useCallback(
    (onValid, onInvalid) => {
      return async (e) => {
        e?.preventDefault();
        const errs = validateAll();
        const hasError = Object.values(errs).some(Boolean);
        if (hasError) {
          onInvalid?.(errs, { values: { ...valuesRef.current } });
          return;
        }
        try {
          setIsSubmitting(true);
          await onValid?.({ ...valuesRef.current }, { reset, setValue, getValues });
        } finally {
          setIsSubmitting(false);
        }
      };
    },
    [getValues, reset, setValue, validateAll]
  );

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    getValues,
    reset,
  };
}
