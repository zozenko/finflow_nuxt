<script setup>
const { t } = useI18n();
useHead({
  title: t("routes.stats"),
});
</script>

<template>
  <UiCard class="flex px-4">STATISTICS</UiCard>
  <PieChart></PieChart>
</template>
