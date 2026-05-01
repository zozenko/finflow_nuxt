<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.home"),
});
const modalStore = useModalStore();
</script>

<template>
  <div class="flex flex-col h-full gap-8">
    <WidgetPieChart class="mt-8" />
    <div class="flex gap-2">
      <UiButton @click="modalStore.openTransaction()">Transaction</UiButton>
      <UiButton @click="modalStore.openCategory()">Category</UiButton>
      <UiButton @click="modalStore.openGroup()">Group</UiButton>
      <UiButton @click="modalStore.openAccount()">Account</UiButton>
    </div>
    <div class="flex flex-col min-h-0 flex-1 md:flex-row w-full gap-8">
      <ListGroup class="flex-1" />
      <ListAccount class="flex-1" />
    </div>
    <WidgetRecentTransactions />
  </div>
</template>
