<script setup lang="ts">
import {
  Plus,
  ArrowRightLeft,
  Tags,
  FolderOpen,
  Wallet,
} from "lucide-vue-next";

const modalStore = useModalStore();
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton class="shrink-0 rounded-2xl gap-2 py-0 sm:px-4 px-2.5">
        <Plus class="size-5 sm:size-4" />
        <span class="hidden sm:inline">{{ $t("common.add") }}</span>
      </UiButton>
    </UiDropdownMenuTrigger>

    <UiDropdownMenuContent align="end" class="w-48">
      <UiDropdownMenuItem
        class="cursor-pointer"
        @click="modalStore.openTransaction()"
      >
        <ArrowRightLeft class="mr-2 size-4 text-muted-foreground" />
        <span>{{ $t("common.transaction") }}</span>
      </UiDropdownMenuItem>

      <UiDropdownMenuSeparator />

      <UiDropdownMenuItem
        class="cursor-pointer"
        @click="modalStore.openAccount()"
      >
        <Wallet class="mr-2 size-4 text-muted-foreground" />
        <span>{{ $t("common.account") }}</span>
      </UiDropdownMenuItem>

      <UiDropdownMenuItem
        class="cursor-pointer"
        @click="modalStore.openGroup()"
      >
        <FolderOpen class="mr-2 size-4 text-muted-foreground" />
        <span>{{ $t("common.group") }}</span>
      </UiDropdownMenuItem>

      <UiDropdownMenuItem
        class="cursor-pointer"
        @click="modalStore.openCategory()"
      >
        <Tags class="mr-2 size-4 text-muted-foreground" />
        <span>{{ $t("common.category") }}</span>
      </UiDropdownMenuItem>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
