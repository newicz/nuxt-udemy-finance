export const useAppToast = () => {
  const toast = useToast();

  const toastSuccess = (title, description = null) => {
    toast.add({
      title,
      description,
      icon: "i-heroicons-check-circle",
      color: "primary",
    });
  };

  const toastError = (title, description = null) => {
    toast.add({
      title,
      description,
      icon: "i-heroicons-exclamation-circle",
      color: "red",
    });
  };

  return {
    toastSuccess,
    toastError,
  };
};
