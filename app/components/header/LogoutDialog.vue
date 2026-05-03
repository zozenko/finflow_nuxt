<script setup lang="ts">
import { LogOut } from "lucide-vue-next";

defineProps<{
  isMobile?: boolean;
}>();

const { logout } = useAuth();
const { t } = useI18n();
</script>

<template>
  <UiAlertDialog>
    <UiAlertDialogTrigger as-child v-bind="$attrs">
      <template v-if="isMobile">
        <div class="md:hidden flex w-full h-full items-center text-destructive">
          <LogOut class="mr-2 size-4" />
          <span>{{ t("common.logout") }}</span>
        </div>
      </template>
      <template v-else>
        <UiButton
          class="hidden md:block rounded-2xl p-0 bg-destructive hover:bg-red-700"
        >
          <LogOut class="size-5" /> </UiButton
      ></template>
    </UiAlertDialogTrigger>

    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>{{
          t("header.logout_confirm_title")
        }}</UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ t("header.logout_confirm_description") }}
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>
      <UiAlertDialogFooter>
        <UiAlertDialogCancel>{{ t("common.cancel") }}</UiAlertDialogCancel>
        <UiAlertDialogAction
          class="bg-destructive hover:bg-destructive/90"
          @click="logout"
        >
          {{ t("common.logout") }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
