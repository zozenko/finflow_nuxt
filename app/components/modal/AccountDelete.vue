<script setup lang="ts">
import { ref, computed } from "vue";
import type { Account } from "~/types";
import { Loader2 } from "lucide-vue-next";

const { accounts, deleteAccount, isDeleting } = useAccounts();
const { t } = useI18n();

interface Props {
  account: Account | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:isOpen"]);

const transferAccountId = ref<string | null>(null);
const leaveUnassigned = ref<boolean>(false);

const availableAccounts = computed(() => {
  return (accounts.value || []).filter((a) => a.id !== props.account?.id);
});

const isLastAccount = computed(() => {
  return (accounts.value || []).length <= 1;
});

function handleConfirm() {
  if (!props.account || isLastAccount.value) return;

  const accountIdToAssign = transferAccountId.value
    ? Number(transferAccountId.value)
    : null;

  deleteAccount(
    {
      id: props.account.id,
      payload: {
        reassign_to_account_id: leaveUnassigned.value
          ? null
          : accountIdToAssign,
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
  transferAccountId.value = null;
  leaveUnassigned.value = false;
}
</script>

<template>
  <UiAlertDialog :open="isOpen" @update:open="handleClose">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ t("deletion.account.title") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          <template v-if="isLastAccount">
            {{ t("deletion.account.last_account_warning") }}
          </template>
          <template v-else>
            {{ t("deletion.account.description") }}
            <div class="mt-4 font-medium text-foreground">
              <span>{{ $t("form.name_label") }}: </span>
              <span class="italic">{{ account?.name }}</span>
            </div>
          </template>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <div v-if="!isLastAccount" class="my-4 flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <UiLabel :class="{ 'text-muted-foreground': leaveUnassigned }">
            {{ t("deletion.account.transfer_label") }}
          </UiLabel>
          <UiSelect v-model="transferAccountId" :disabled="leaveUnassigned">
            <UiSelectTrigger class="w-full bg-section">
              <UiSelectValue
                :placeholder="t('deletion.account.select_account')"
              />
            </UiSelectTrigger>
            <UiSelectContent>
              <UiSelectItem
                v-for="a in availableAccounts"
                :key="a.id"
                :value="String(a.id)"
              >
                {{ a.name }}
              </UiSelectItem>
            </UiSelectContent>
          </UiSelect>
        </div>

        <div class="flex items-center space-x-2">
          <UiCheckbox id="leave-unassigned-account" v-model="leaveUnassigned" />
          <UiLabel
            for="leave-unassigned-account"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {{ t("deletion.account.delete_transactions") }}
          </UiLabel>
        </div>
      </div>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel :disabled="isDeleting">
          {{ t("common.cancel") }}
        </UiAlertDialogCancel>
        <UiButton
          v-if="!isLastAccount"
          variant="destructive"
          :disabled="isDeleting || (!leaveUnassigned && !transferAccountId)"
          @click="handleConfirm"
        >
          <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
          {{ t("deletion.confirm") }}
        </UiButton>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
