export const useApi = () => {
  const isLoading = ref(false);

  const execute = async <T>(task: () => Promise<T>): Promise<T | undefined> => {
    isLoading.value = true;
    try {
      return await task();
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, execute };
};
