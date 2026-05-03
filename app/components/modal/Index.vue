<script setup lang="ts">
const modalStore = useModalStore();
</script>

<template>
  <div>
    <!-- Forms -->
    <ModalCategoryForm
      :is-open="modalStore.categoryModal.isOpen"
      :edit-data="modalStore.categoryModal.editData"
      @update:is-open="!$event ? modalStore.closeCategory() : null"
      @success="modalStore.closeCategory"
    />

    <ModalGroupForm
      :is-open="modalStore.groupModal.isOpen"
      :edit-data="modalStore.groupModal.editData"
      @update:is-open="!$event ? modalStore.closeGroup() : null"
      @success="modalStore.closeGroup"
    />

    <ModalAccountForm
      :is-open="modalStore.accountModal.isOpen"
      :edit-data="modalStore.accountModal.editData"
      @update:is-open="!$event ? modalStore.closeAccount() : null"
      @success="modalStore.closeAccount"
    />

    <ModalTransactionForm
      :is-open="modalStore.transactionModal.isOpen"
      :edit-data="modalStore.transactionModal.editData"
      @update:is-open="!$event ? modalStore.closeTransaction() : null"
      @success="modalStore.closeTransaction"
    />

    <ModalTransactionDelete
      :is-open="modalStore.deleteTransactionModal.isOpen"
      :transaction="modalStore.deleteTransactionModal.data"
      @update:is-open="!$event ? modalStore.closeDeleteTransaction() : null"
      @success="modalStore.closeDeleteTransaction"
    />

    <ModalCategoryDelete
      :is-open="modalStore.deleteCategoryModal.isOpen"
      :category="modalStore.deleteCategoryModal.data"
      @update:is-open="!$event ? modalStore.closeDeleteCategory() : null"
      @success="modalStore.closeDeleteCategory"
    />

    <ModalGroupDelete
      :is-open="modalStore.deleteGroupModal.isOpen"
      :group="modalStore.deleteGroupModal.data"
      @update:is-open="!$event ? modalStore.closeDeleteGroup() : null"
      @success="modalStore.closeDeleteGroup"
    />

    <ModalAccountDelete
      :is-open="modalStore.deleteAccountModal.isOpen"
      :account="modalStore.deleteAccountModal.data"
      @update:is-open="!$event ? modalStore.closeDeleteAccount() : null"
      @success="modalStore.closeDeleteAccount"
    />
  </div>
</template>
