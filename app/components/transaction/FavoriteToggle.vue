<script setup lang="ts">
import { Star } from "lucide-vue-next";

interface Props {
  modelValue: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function toggle() {
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue);
  }
}
</script>

<template>
  <UiButton
    type="button"
    variant="ghost"
    size="icon"
    :title="$t('Lists.delete')"
    class="hover:bg-yellow-50 hover:text-yellow-400"
    :disabled="disabled"
    @click="toggle"
  >
    <Star
      class="size-5 transition-colors hover:text-yellow-400"
      :class="{ 'fill-yellow-400 text-yellow-400': modelValue }"
    />
  </UiButton>
</template>
