<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.stats"),
});
</script>

<template>
  <WidgetPieChart />
</template>
