/**
 * @vitest-environment happy-dom
 */
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach } from "vitest";
import { useModalStore } from "./useModalStore";
import type { Category, Group, Account, Transaction } from "~/types";

describe("Modal Store (Стор модальних вікон)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // ==========================================
  // CATEGORIES
  // ==========================================
  describe("Categories", () => {
    const mockCategory = { id: 1, name: "Food" } as Category;

    it("керує станом модалки створення/редагування", () => {
      const store = useModalStore();

      expect(store.categoryModal.isOpen).toBe(false);
      expect(store.categoryModal.editData).toBeNull();

      store.openCategory();
      expect(store.categoryModal.isOpen).toBe(true);
      expect(store.categoryModal.editData).toBeNull();

      store.openCategory(mockCategory);
      expect(store.categoryModal.isOpen).toBe(true);
      expect(store.categoryModal.editData).toEqual(mockCategory);

      store.closeCategory();
      expect(store.categoryModal.isOpen).toBe(false);
      expect(store.categoryModal.editData).toBeNull();
    });

    it("керує станом модалки видалення", () => {
      const store = useModalStore();

      store.openDeleteCategory(mockCategory);
      expect(store.deleteCategoryModal.isOpen).toBe(true);
      expect(store.deleteCategoryModal.data).toEqual(mockCategory);

      store.closeDeleteCategory();
      expect(store.deleteCategoryModal.isOpen).toBe(false);
      expect(store.deleteCategoryModal.data).toBeNull();
    });
  });

  describe("Groups", () => {
    const mockGroup = { id: 2, name: "Cash" } as Group;

    it("керує станом модалки створення/редагування", () => {
      const store = useModalStore();

      store.openGroup();
      expect(store.groupModal.isOpen).toBe(true);
      expect(store.groupModal.editData).toBeNull();

      store.openGroup(mockGroup);
      expect(store.groupModal.editData).toEqual(mockGroup);

      store.closeGroup();
      expect(store.groupModal.isOpen).toBe(false);
      expect(store.groupModal.editData).toBeNull();
    });

    it("керує станом модалки видалення", () => {
      const store = useModalStore();

      store.openDeleteGroup(mockGroup);
      expect(store.deleteGroupModal.isOpen).toBe(true);
      expect(store.deleteGroupModal.data).toEqual(mockGroup);

      store.closeDeleteGroup();
      expect(store.deleteGroupModal.isOpen).toBe(false);
      expect(store.deleteGroupModal.data).toBeNull();
    });
  });

  describe("Accounts", () => {
    const mockAccount = { id: 5, name: "MonoCard", balance: 1000 } as Account;

    it("керує станом модалки створення/редагування", () => {
      const store = useModalStore();

      store.openAccount();
      expect(store.accountModal.isOpen).toBe(true);
      expect(store.accountModal.editData).toBeNull();

      store.openAccount(mockAccount);
      expect(store.accountModal.isOpen).toBe(true);
      expect(store.accountModal.editData).toEqual(mockAccount);

      store.closeAccount();
      expect(store.accountModal.isOpen).toBe(false);
      expect(store.accountModal.editData).toBeNull();
    });

    it("керує станом модалки видалення", () => {
      const store = useModalStore();

      store.openDeleteAccount(mockAccount);
      expect(store.deleteAccountModal.isOpen).toBe(true);
      expect(store.deleteAccountModal.data).toEqual(mockAccount);

      store.closeDeleteAccount();
      expect(store.deleteAccountModal.isOpen).toBe(false);
      expect(store.deleteAccountModal.data).toBeNull();
    });
  });

  describe("Transactions", () => {
    const mockTransaction = {
      id: 10,
      amount: 500,
      type: "expense",
    } as Transaction;

    it("керує станом модалки створення/редагування", () => {
      const store = useModalStore();

      store.openTransaction();
      expect(store.transactionModal.isOpen).toBe(true);
      expect(store.transactionModal.editData).toBeNull();

      store.openTransaction(mockTransaction);
      expect(store.transactionModal.isOpen).toBe(true);
      expect(store.transactionModal.editData).toEqual(mockTransaction);

      store.closeTransaction();
      expect(store.transactionModal.isOpen).toBe(false);
      expect(store.transactionModal.editData).toBeNull();
    });

    it("керує станом модалки видалення", () => {
      const store = useModalStore();

      store.openDeleteTransaction(mockTransaction);
      expect(store.deleteTransactionModal.isOpen).toBe(true);
      expect(store.deleteTransactionModal.data).toEqual(mockTransaction);

      store.closeDeleteTransaction();
      expect(store.deleteTransactionModal.isOpen).toBe(false);
      expect(store.deleteTransactionModal.data).toEqual(mockTransaction);
    });
  });
});
