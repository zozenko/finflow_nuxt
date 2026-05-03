<script setup>
useHead({
  title: $t("routes.home"),
});
</script>

<template>
  <div class="flex flex-col h-full gap-8">
    <WidgetPieChart class="mt-4" />
    <div class="flex flex-col min-h-0 flex-1 md:flex-row w-full gap-8">
      <ListGroups class="flex-1" />
      <ListAccounts class="flex-1" />
    </div>
    <WidgetRecentTransactions />
  </div>
</template>
