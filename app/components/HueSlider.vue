<script setup lang="ts">
import { SliderRoot, SliderThumb, SliderTrack } from "reka-ui";
import { colord } from "colord";

const props = defineProps<{
  modelValue?: string | null;
}>();

const emit = defineEmits(["update:modelValue"]);
const getHueFromHex = (hex: string | null | undefined) => [
  colord(hex || "#00b079").toHsl().h,
];

const hueValue = ref(getHueFromHex(props.modelValue));

watch(
  hueValue,
  ([newHue]) => {
    const hue = newHue ?? 0;
    const hex = colord({ h: hue, s: 80, l: 50 }).toHex();
    emit("update:modelValue", hex);
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (newHex) => {
    const result = getHueFromHex(newHex);
    const newHue = result[0] ?? 0;
    if (newHue !== hueValue.value[0]) {
      hueValue.value = [newHue];
    }
  },
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <SliderRoot
      v-model="hueValue"
      :max="360"
      :step="1"
      class="relative flex items-center select-none touch-none w-full h-8 group"
    >
      <SliderTrack
        class="relative grow h-4 rounded-[4px] border mx-2 border-black/5 shadow-inner"
        style="
          background: linear-gradient(
            to right,
            #f00 0%,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            #f00 100%
          );
        "
      />

      <SliderThumb
        class="relative flex h-8 w-6 touch-none items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none group select-none"
        aria-label="Оберіть колір"
      >
        <div
          class="w-2 h-6 bg-section rounded-full border transition-transform"
        />
      </SliderThumb>
    </SliderRoot>
  </div>
</template>
