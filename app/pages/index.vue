<script setup>
import { toast } from "vue-sonner";
const { t } = useI18n();
useHead({
  title: t("routes.home"),
});

const modalStore = useModalStore();

const selectedCategory = ref(null);
</script>

<template>
  <div class="flex flex-col h-full gap-8">
    <PieChart class="mt-8" />
    <div class="flex gap-2">
      <UiButton @click="() => toast.success('My first success')"
        >Transaction</UiButton
      >
      <UiButton @click="() => toast.warning('My first warning')"
        >Category</UiButton
      >
      <UiButton @click="() => toast.error('My first error')">Group</UiButton>
      <UiButton @click="modalStore.openCategory()">Account</UiButton>
    </div>
    <div class="flex flex-col min-h-0 flex-1 md:flex-row w-full gap-8">
      <GroupList class="flex-1"></GroupList>
      <AccountList class="flex-1"></AccountList>
    </div>
    <RecentTransactionsWidget />
  </div>
</template>
