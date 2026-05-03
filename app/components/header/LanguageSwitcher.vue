<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "#imports";

const { locale, setLocale } = useI18n();

const displayLang = computed(() => {
  return locale.value === "uk" ? "UA" : "EN";
});
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="outline"
        class="h-9 w-11 rounded-2xl p-0 flex items-center justify-center font-bold hover:bg-muted shrink-0"
      >
        {{ displayLang }}
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent align="end" class="min-w-16">
      <UiDropdownMenuItem
        class="cursor-pointer font-medium justify-center"
        :class="{ 'bg-muted': locale === 'uk' }"
        @click="setLocale('uk')"
      >
        UA
      </UiDropdownMenuItem>
      <UiDropdownMenuItem
        class="cursor-pointer font-medium justify-center"
        :class="{ 'bg-muted': locale === 'en' }"
        @click="setLocale('en')"
      >
        EN
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
