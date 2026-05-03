<script setup lang="ts">
const authStore = useAuthStore();
const navLinks = [
  { name: "header.nav.accounts", path: "/" },
  { name: "header.nav.transactions", path: "transactions" },
  { name: "header.nav.statistics", path: "statistics" },
];
</script>

<template>
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
          <span class="text-foreground font-semibold">
            {{ authStore.user?.name }} </span
          >!
        </span>
      </div>

      <div class="mr-2 hidden items-center gap-6 md:flex">
        <NuxtLinkLocale
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-muted-foreground hover:text-primary font-medium transition-colors"
          active-class="text-primary font-semibold"
        >
          {{ $t(link.name) }}
        </NuxtLinkLocale>
      </div>
      <div class="flex items-center gap-2">
        <HeaderCreateMenu />

        <HeaderLanguageSwitcher />

        <HeaderLogoutDialog class="hidden md:block" :is-mobile="false" />

        <HeaderMobileMenu />
      </div>
    </nav>
  </header>
</template>
