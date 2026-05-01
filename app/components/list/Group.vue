<script setup lang="ts">
const modalStore = useModalStore();
const { groups } = useGroups();
</script>

<template>
  <UiAccordion type="multiple" class="flex flex-col gap-2">
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
              class="size-6"
              :style="{ color: group.color || '#6B7280' }"
            />
            <span class="font-medium">{{ group.name }}</span>
          </div>
          <EntityActions
            @edit="modalStore.openGroup(group)"
            @delete="modalStore.openDeleteGroup(group)"
          />
        </div>
      </UiAccordionTrigger>

      <UiAccordionContent class="pb-4">
        <ListCategory :group-id="group.id" />
      </UiAccordionContent>
    </UiAccordionItem>
  </UiAccordion>
</template>
