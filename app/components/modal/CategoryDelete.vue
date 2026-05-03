<script setup lang="ts">
import type { Category } from "~/types";
import { Loader2 } from "lucide-vue-next";

const { deleteCategory, isDeleting, getCategoriesByGroupId } = useCategories();
const { groups } = useGroups();

interface Props {
  category: Category | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:isOpen"]);

const transferGroupId = ref<string | null>(null);
const transferCategoryId = ref<string | null>(null);
const leaveUnassigned = ref<boolean>(false);

const filteredCategories = computed(() => {
  if (!transferGroupId.value) {
    return [];
  }
  return getCategoriesByGroupId(Number(transferGroupId.value)).value.filter(
    (c) => c.id !== props.category?.id,
  );
});

watch(transferGroupId, () => {
  transferCategoryId.value = null;
});

function handleConfirm() {
  if (!props.category) return;

  const categoryIdToAssign = transferCategoryId.value
    ? Number(transferCategoryId.value)
    : null;

  deleteCategory(
    {
      id: props.category.id,
      payload: {
        reassign_to_category_id: leaveUnassigned.value
          ? null
          : categoryIdToAssign,
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
  transferCategoryId.value = null;
  leaveUnassigned.value = false;
}
</script>

<template>
  <UiAlertDialog :open="isOpen" @update:open="handleClose">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ $t("deletion.category.title") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ $t("deletion.category.description") }}
          <template v-if="category">
            <div class="mt-4 font-medium text-foreground">
              <span>{{ $t("form.name_label") }}: </span>
              <span class="italic">{{ category.name }}</span>
            </div>
            <div class="mt-2 font-medium text-foreground">
              <span>{{ $t("category.form.group_label") }}: </span>
              <span class="italic">{{
                groups?.find((g) => g.id === category?.group_id)?.name
              }}</span>
            </div>
          </template>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <div class="my-4 flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Group Select -->
          <div class="flex-1">
            <UiSelect v-model="transferGroupId" :disabled="leaveUnassigned">
              <UiSelectTrigger class="w-full bg-section">
                <UiSelectValue
                  :placeholder="$t('deletion.category.select_group')"
                />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="group in groups"
                  :key="group.id"
                  :value="String(group.id)"
                >
                  {{ group.name }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </div>

          <!-- Category Select -->
          <div class="flex-1">
            <UiSelect
              v-model="transferCategoryId"
              :disabled="!transferGroupId || leaveUnassigned"
            >
              <UiSelectTrigger class="w-full bg-section">
                <UiSelectValue
                  :placeholder="$t('deletion.category.select_category')"
                />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="cat in filteredCategories"
                  :key="cat.id"
                  :value="String(cat.id)"
                >
                  {{ cat.name }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <UiCheckbox id="leave-unassigned" v-model="leaveUnassigned" />
        <UiLabel
          for="leave-unassigned"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {{ $t("deletion.category.leave_unassigned") }}
        </UiLabel>
      </div>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel :disabled="isDeleting">
          {{ $t("common.cancel") }}
        </UiAlertDialogCancel>
        <UiButton
          variant="destructive"
          :disabled="isDeleting || (!leaveUnassigned && !transferCategoryId)"
          @click="handleConfirm"
        >
          <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t("deletion.confirm") }}
        </UiButton>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
