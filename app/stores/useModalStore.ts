export const useModalStore = defineStore("modals", () => {
  const categoryModal = ref({
    isOpen: false,
    editData: null as any | null,
  });

  const openCategory = (data = null) => {
    categoryModal.value.editData = data;
    categoryModal.value.isOpen = true;
  };

  const closeCategory = () => {
    categoryModal.value.isOpen = false;
    categoryModal.value.editData = null;
  };

  return { categoryModal, openCategory, closeCategory };
});
