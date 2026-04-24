<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.home"),
});

const isModalOpen = ref(false);
const selectedCategory = ref(null);

const openCreateModal = () => {
  selectedCategory.value = null;
  isModalOpen.value = true;
};

const openEditModal = (category) => {
  selectedCategory.value = category;
  isModalOpen.value = true;
};
</script>

<template>
  <div class="flex flex-col h-full gap-8">
    <PieChart class="mt-8" />
    <div class="flex gap-2">
      <UiButton c>Transaction</UiButton>
      <UiButton>Category</UiButton>
      <UiButton>Group</UiButton>
      <UiButton>Account</UiButton>
    </div>
    <div class="flex flex-col min-h-0 flex-1 md:flex-row w-full gap-8">
      <GroupList class="flex-1"></GroupList>
      <AccountList class="flex-1"></AccountList>
    </div>
    <RecentTransactionsWidget />
  </div>
</template>
