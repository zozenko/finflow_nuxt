<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "edit"): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (e: "delete"): void;
}>();
</script>

<template>
  <div class="flex items-center">
    <UiButton
      variant="ghost"
      size="icon"
      :title="$t('Lists.edit')"
      class="hover:bg-green-50 hover:text-primary dark:hover:bg-green-950/30"
      @click.stop="emit('edit')"
    >
      <Pencil class="size-4.5" />
    </UiButton>

    <UiButton
      variant="ghost"
      size="icon"
      :title="$t('Lists.delete')"
      class="hover:bg-red-50 hover:text-destructive dark:hover:bg-red-950/30"
      @click.stop="emit('delete')"
    >
      <Trash2 class="size-4.5" />
    </UiButton>
  </div>
</template>
