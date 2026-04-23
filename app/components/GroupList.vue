<script setup lang="ts">
import { Pencil, Trash2 } from "lucide-vue-next";

const { t } = useI18n();
const { groups } = useGroups();
</script>

<template>
  <UiAccordion type="multiple">
    <UiAccordionItem
      v-for="group in groups"
      :key="group.id"
      :value="`group-${group.id}`"
      class="border rounded-lg px-4 shadow-sm"
    >
      <UiAccordionTrigger class="text-lg py-4 underline-offset-4">
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-3">
            <component
              :is="getIcon(group.icon_key)"
              class="w-5 h-5"
              :style="{ color: group.color || '#6B7280' }"
            />
            <span class="font-medium">{{ group.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UiButton
              variant="ghost"
              size="icon"
              :title="t('Lists.GroupList.edit')"
              class="hover:text-primary hover:bg-green-50"
            >
              <Pencil class="size-4.5" />
            </UiButton>
            <UiButton
              variant="ghost"
              size="icon"
              :title="t('Lists.GroupList.delete')"
              class="hover:text-destructive hover:bg-red-50"
            >
              <Trash2 class="size-4.5" />
            </UiButton>
          </div>
        </div>
      </UiAccordionTrigger>

      <UiAccordionContent class="pb-4">
        <CategoryList :group-id="group.id" />
      </UiAccordionContent>
    </UiAccordionItem>
  </UiAccordion>
</template>
