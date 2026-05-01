<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.trans"),
});
</script>
<template>
  <TransactionsTable />
</template>
