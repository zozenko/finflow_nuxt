<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.home"),
});
</script>

<template>
  <div class="flex flex-col gap-8 mt-8">
    <PieChart></PieChart>
    <div class="flex flex-col md:flex-row w-full gap-8">
      <GroupList class="flex-1"></GroupList>
      <AccountList class="flex-1"></AccountList>
    </div>
    <TransactionTable></TransactionTable>
  </div>
</template>
