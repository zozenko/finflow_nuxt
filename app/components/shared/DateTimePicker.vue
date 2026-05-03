<script setup lang="ts">
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { CalendarIcon, Clock } from "lucide-vue-next";

const props = defineProps<{
  modelValue?: string | null;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const { dayjs } = useDate();

const parseModelValue = () => {
  if (!props.modelValue) return null;
  const d = dayjs.utc(props.modelValue).local();
  return d.isValid() ? d : null;
};

const calendarValue = computed({
  get: () => {
    const d = parseModelValue();
    if (!d) return undefined;
    return fromDate(d.toDate(), getLocalTimeZone());
  },
  set: (val) => {
    if (val) {
      const current = parseModelValue() || dayjs();
      console.log(val.toString());
      console.log(val.toDate());
      const updated = dayjs(val.toDate())
        .set("hour", current.hour())
        .set("minute", current.minute())
        .set("second", 0);

      emit("update:modelValue", updated.utc().format());
    }
  },
});

const updateTime = (type: "hour" | "minute", value: string) => {
  const current = parseModelValue() || dayjs();
  const updated = current.set(type, parseInt(value)).set("second", 0);
  emit("update:modelValue", updated.utc().format());
};

const selectedHour = computed(() => parseModelValue()?.format("HH") || "00");
const selectedMinute = computed(() => parseModelValue()?.format("mm") || "00");

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

const displayValue = computed(() => {
  const d = parseModelValue();
  return d
    ? d.format("DD.MM.YYYY HH:mm")
    : props.placeholder || $t("form.date_placeholder");
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <UiPopover>
      <UiPopoverTrigger as-child>
        <UiButton
          variant="outline"
          class="w-full justify-start bg-transparent text-left font-normal h-10 px-3"
          :class="!modelValue && 'text-muted-foreground'"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          <span>
            {{ displayValue }}
          </span>
        </UiButton>
      </UiPopoverTrigger>

      <UiPopoverContent class="w-auto p-0" align="start">
        <UiCalendar v-model="calendarValue" initial-focus />

        <div
          class="flex items-center justify-center gap-2 border-t p-3 bg-muted/20 font-mono"
        >
          <Clock class="size-5 text-muted-foreground mr-1" />

          <UiSelect
            :model-value="selectedHour"
            @update:model-value="(v) => v && updateTime('hour', v.toString())"
          >
            <UiSelectTrigger class="w-16 h-8 px-2">
              <UiSelectValue class="pl-1.5" />
            </UiSelectTrigger>
            <UiSelectContent class="h-48 min-w-16">
              <UiSelectItem
                v-for="h in hours"
                :key="h"
                :value="h"
                class="pl-7.75"
                >{{ h }}</UiSelectItem
              >
            </UiSelectContent>
          </UiSelect>

          <span>:</span>

          <UiSelect
            :model-value="selectedMinute"
            @update:model-value="(v) => v && updateTime('minute', v.toString())"
          >
            <UiSelectTrigger class="w-16 h-8 px-2">
              <UiSelectValue class="pl-1.5" />
            </UiSelectTrigger>
            <UiSelectContent class="h-48 min-w-16">
              <UiSelectItem
                v-for="m in minutes"
                :key="m"
                :value="m"
                class="pl-7.75"
                >{{ m }}</UiSelectItem
              >
            </UiSelectContent>
          </UiSelect>
        </div>
      </UiPopoverContent>
    </UiPopover>
  </div>
</template>
