<script setup lang="ts">
const props = defineProps<{
  modelValue?: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const { getIcon, iconKeys } = useIcons();

const selectIcon = (name: string) => {
  emit("update:modelValue", name);
};

onMounted(() => {
  const defaultIcon = iconKeys[0];
  if (!props.modelValue && defaultIcon) {
    emit("update:modelValue", defaultIcon);
  }
});
</script>

<template>
  <UiScrollArea class="h-30.5 w-full rounded-lg border p-2">
    <div class="grid grid-cols-5 gap-2">
      <UiButton
        v-for="key in iconKeys"
        :key="key"
        type="button"
        :variant="modelValue === key ? 'default' : 'outline'"
        class="flex h-12 w-full items-center justify-center p-1 transition-all"
        @click="selectIcon(key)"
      >
        <component :is="getIcon(key)" class="size-5" />
      </UiButton></div
  ></UiScrollArea>
</template>
