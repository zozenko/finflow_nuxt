<script setup lang="ts">
import { ref, computed } from "vue";
import type { Group } from "~/types"; // Переконайтеся, що шлях правильний
import { Loader2 } from "lucide-vue-next";

// Припускаю, що useGroups повертає масив груп і метод видалення
const { groups, deleteGroup, isDeleting } = useGroups();

interface Props {
  group: Group | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:isOpen"]);

const transferGroupId = ref<string | null>(null);
const leaveUnassigned = ref<boolean>(false);

// Відфільтровуємо поточну групу, яку збираємося видалити
const availableGroups = computed(() => {
  return (groups.value || []).filter((g) => g.id !== props.group?.id);
});

function handleConfirm() {
  if (!props.group) return;

  const groupIdToAssign = transferGroupId.value
    ? Number(transferGroupId.value)
    : null;

  deleteGroup(
    {
      id: props.group.id,
      payload: {
        reassign_to_group_id: leaveUnassigned.value ? null : groupIdToAssign,
      },
    },
    {
      onSuccess: () => {
        emit("update:isOpen", false);
        resetState();
      },
    },
  );
}

function handleClose() {
  emit("update:isOpen", false);
  resetState();
}

function resetState() {
  transferGroupId.value = null;
  leaveUnassigned.value = false;
}
</script>

<template>
  <UiAlertDialog :open="isOpen" @update:open="handleClose">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ $t("deletion.group.title") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ $t("deletion.group.description") }}
          <template v-if="group">
            <div class="mt-2 font-medium text-foreground italic">
              {{ group.name }}
            </div>
          </template>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <div class="my-4 flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <UiLabel :class="{ 'text-muted-foreground': leaveUnassigned }">
            {{ $t("deletion.group.transfer_label") }}
          </UiLabel>
          <UiSelect v-model="transferGroupId" :disabled="leaveUnassigned">
            <UiSelectTrigger class="w-full bg-section">
              <UiSelectValue :placeholder="$t('deletion.group.select_group')" />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem
                v-for="g in availableGroups"
                :key="g.id"
                :value="String(g.id)"
              >
                {{ g.name }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <div class="flex items-center space-x-2">
          <UiCheckbox id="leave-unassigned-group" v-model="leaveUnassigned" />
          <UiLabel
            for="leave-unassigned-group"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {{ $t("deletion.group.leave_unassigned") }}
          </UiLabel>
        </div>
      </div>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel :disabled="isDeleting">
          {{ $t("common.cancel") }}
        </UiAlertDialogCancel>
        <UiButton
          variant="destructive"
          :disabled="isDeleting || (!leaveUnassigned && !transferGroupId)"
          @click="handleConfirm"
        >
          <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t("deletion.confirm") }}
        </UiButton>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
