import { defineStore } from "pinia";
import { ref } from "vue";
import type { Category, Group, Account, Transaction } from "~/types";

export const useModalStore = defineStore("modals", () => {
  // --- Categories ---
  const categoryModal = ref({
    isOpen: false,
    editData: null as Category | null,
  });

  const openCategory = (data: Category | null = null) => {
    categoryModal.value.editData = data;
    categoryModal.value.isOpen = true;
  };

  const closeCategory = () => {
    categoryModal.value.isOpen = false;
    categoryModal.value.editData = null;
  };

  // --- Category Deletion ---
  const deleteCategoryModal = ref({
    isOpen: false,
    data: null as Category | null,
  });

  const openDeleteCategory = (data: Category) => {
    deleteCategoryModal.value.data = data;
    deleteCategoryModal.value.isOpen = true;
  };

  const closeDeleteCategory = () => {
    deleteCategoryModal.value.isOpen = false;
    deleteCategoryModal.value.data = null;
  };

  // --- Groups ---
  const groupModal = ref({
    isOpen: false,
    editData: null as Group | null,
  });

  const openGroup = (data: Group | null = null) => {
    groupModal.value.editData = data;
    groupModal.value.isOpen = true;
  };

  const closeGroup = () => {
    groupModal.value.isOpen = false;
    groupModal.value.editData = null;
  };

  // --- Group Deletion ---
  const deleteGroupModal = ref({
    isOpen: false,
    data: null as Group | null,
  });

  const openDeleteGroup = (data: Group) => {
    deleteGroupModal.value.data = data;
    deleteGroupModal.value.isOpen = true;
  };

  const closeDeleteGroup = () => {
    deleteGroupModal.value.isOpen = false;
    deleteGroupModal.value.data = null;
  };

  // --- Accounts ---
  const accountModal = ref({
    isOpen: false,
    editData: null as Account | null,
  });

  const openAccount = (data: Account | null = null) => {
    accountModal.value.editData = data;
    accountModal.value.isOpen = true;
  };

  const closeAccount = () => {
    accountModal.value.isOpen = false;
    accountModal.value.editData = null;
  };

  // --- Account Deletion ---
  const deleteAccountModal = ref({
    isOpen: false,
    data: null as Account | null,
  });

  const openDeleteAccount = (data: Account) => {
    deleteAccountModal.value.data = data;
    deleteAccountModal.value.isOpen = true;
  };

  const closeDeleteAccount = () => {
    deleteAccountModal.value.isOpen = false;
    deleteAccountModal.value.data = null;
  };

  // --- Transactions ---
  const transactionModal = ref({
    isOpen: false,
    editData: null as Transaction | null,
  });

  const openTransaction = (data: Transaction | null = null) => {
    transactionModal.value.editData = data;
    transactionModal.value.isOpen = true;
  };

  const closeTransaction = () => {
    transactionModal.value.isOpen = false;
    transactionModal.value.editData = null;
  };

  // --- Transaction Deletion ---
  const deleteTransactionModal = ref({
    isOpen: false,
    data: {} as Transaction,
  });

  const openDeleteTransaction = (data: Transaction) => {
    deleteTransactionModal.value.data = data;
    deleteTransactionModal.value.isOpen = true;
  };

  const closeDeleteTransaction = () => {
    deleteTransactionModal.value.isOpen = false;
  };

  return {
    categoryModal,
    openCategory,
    closeCategory,
    deleteCategoryModal,
    openDeleteCategory,
    closeDeleteCategory,
    groupModal,
    openGroup,
    closeGroup,
    deleteGroupModal,
    openDeleteGroup,
    closeDeleteGroup,
    accountModal,
    openAccount,
    closeAccount,
    deleteAccountModal,
    openDeleteAccount,
    closeDeleteAccount,
    transactionModal,
    openTransaction,
    closeTransaction,
    deleteTransactionModal,
    openDeleteTransaction,
    closeDeleteTransaction,
  };
});
