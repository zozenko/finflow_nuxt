<script setup lang="ts">
import { useI18n } from "#imports";

const { locale, setLocale } = useI18n();

const toggleLanguage = () => {
  const newLang = locale.value === "uk" ? "en" : "uk";

  // setLocale автоматично оновить параметр lang в URL та змінить мову додатку
  setLocale(newLang);
};
</script>

<template>
  <button
    @click="toggleLanguage"
    class="bg-section border-br-main text-txt-main hover:bg-opacity-80 flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm font-bold shadow-sm transition-all active:scale-95"
  >
    <span :class="{ 'opacity-40': locale !== 'uk' }">UA</span>
    <span class="text-br-main font-light">|</span>
    <span :class="{ 'opacity-40': locale !== 'en' }">EN</span>
  </button>
</template>
