<script setup>
import { LogOut } from "lucide-vue-next";
import { useAuthStore } from "#imports";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import "vue-sonner/style.css";
import CategoryFormModal from "./components/forms/CategoryFormModal.vue";
const { t } = useI18n();
const authStore = useAuthStore();
const modalStore = useModalStore();
const { logout } = useAuth();
const navLinks = [
  { name: "header.nav.accounts", path: "/" },
  { name: "header.nav.transactions", path: "transactions" },
  { name: "header.nav.statistics", path: "statistics" },
];
</script>

<template>
  <div class="flex flex-col h-dvh">
    <header
      v-if="authStore.isAuthenticated"
      class="bg-section border-border shrink-0 sticky top-0 z-50 border-b shadow-sm"
    >
      <nav
        class="mx-auto max-w-content flex h-16 items-center justify-between px-6"
      >
        <div class="flex items-center gap-2">
          <NuxtLinkLocale
            to="/"
            class="flex items-center gap-2 text-xl font-black tracking-tight transition-opacity hover:opacity-80"
          >
            <img
              src="~/assets/images/logo.svg"
              alt="FinFlow Logo"
              class="h-6 w-6"
            />
            <span>FinFlow</span>
          </NuxtLinkLocale>

          <span
            class="border-border text-muted-foreground ml-4 hidden border-l pl-4 text-sm sm:inline"
          >
            {{ $t("header.greeting") }},
            <span class="text-foreground font-semibold">{{
              authStore.user?.name
            }}</span
            >!
          </span>
        </div>

        <div class="flex items-center gap-4">
          <div class="mr-4 hidden items-center gap-6 md:flex">
            <NuxtLinkLocale
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              active-class="text-primary font-semibold"
            >
              {{ $t(link.name) }}
            </NuxtLinkLocale>
          </div>

          <div class="flex items-center gap-2">
            <LanguageSwitcher />
            <UiButton
              @click="logout"
              class="rounded-full p-0 bg-destructive hover:bg-red-700"
              ><LogOut class="size-5"
            /></UiButton>
          </div>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <div class="max-w-content h-full mx-auto px-4">
        <NuxtPage></NuxtPage>
      </div>
    </main>
    <footer class="shrink-0">
      <div
        class="max-w-content mx-auto flex items-center justify-center h-10 text-center px-4"
      >
        <p class="text-sm text-txt-main opacity-70">
          &copy; {{ new Date().getFullYear() }} FinFlow.
          {{ t("footer.made_by") }}
          <span class="font-medium">Alexandr Zozenko</span>
        </p>
      </div>
    </footer>
    <UiToaster position="top-center" />
    <CategoryFormModal
      :is-open="modalStore.categoryModal.isOpen"
      :editData="null"
      @update:is-open="!$event ? modalStore.closeCategory() : null"
      @success="modalStore.closeCategory"
    />
    <ClientOnly> <VueQueryDevtools /> </ClientOnly>
  </div>
</template>
