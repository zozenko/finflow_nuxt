<script setup lang="ts">
import {
  Menu,
  LayoutDashboard,
  ArrowRightLeft,
  PieChart,
} from "lucide-vue-next";

const { t } = useI18n();

const navLinks = [
  { name: "header.nav.accounts", path: "/", icon: LayoutDashboard },
  {
    name: "header.nav.transactions",
    path: "/transactions",
    icon: ArrowRightLeft,
  },
  { name: "header.nav.statistics", path: "/statistics", icon: PieChart },
];
</script>

<template>
  <UiDropdownMenu class="md:hidden">
    <UiDropdownMenuTrigger as-child>
      <UiButton
        variant="outline"
        class="md:hidden rounded-2xl p-0 md:bg-destructive md:hover:bg-destructive/90"
      >
        <Menu class="size-5" />
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent align="end" class="w-56">
      <div class="md:hidden">
        <UiDropdownMenuLabel>{{ t("common.navigation") }}</UiDropdownMenuLabel>
        <UiDropdownMenuItem v-for="link in navLinks" :key="link.path" as-child>
          <NuxtLinkLocale
            :to="link.path"
            class="flex w-full items-center cursor-pointer"
          >
            <component
              :is="link.icon"
              class="mr-2 size-4 text-muted-foreground"
            />
            <span>{{ t(link.name) }}</span>
          </NuxtLinkLocale>
        </UiDropdownMenuItem>
        <UiDropdownMenuSeparator />
      </div>

      <UiDropdownMenuItem
        class="cursor-pointer text-destructive focus:text-destructive"
        as-child
        @select.prevent
        ><HeaderLogoutDialog class="md:hidden" :is-mobile="true" />
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
