export const handleApiError = (error, fallbackMessage, setErrors) => {
  const data = error?.response?.data;

  if (Array.isArray(data)) {
    setErrors(data);
  } else if (data?.message) {
    setErrors([data.message]);
  } else {
    setErrors([fallbackMessage || "Ocurrió un error inesperado."]);
  }
};
