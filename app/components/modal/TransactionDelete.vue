<script setup lang="ts">
import type { Transaction } from "~/types";
import { Loader2 } from "lucide-vue-next";

const { deleteTransaction, isDeleting } = useTransactions();

interface Props {
  transaction: Transaction;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:isOpen"]);

function handleConfirm() {
  deleteTransaction(props.transaction.id, {
    onSuccess: () => {
      emit("update:isOpen", false);
    },
  });
}

function handleClose() {
  emit("update:isOpen", false);
}
</script>

<template>
  <UiAlertDialog :open="isOpen" @update:open="handleClose">
    <UiAlertDialogContent>
      <UiAlertDialogHeader>
        <UiAlertDialogTitle>
          {{ $t("deletion.transaction.title") }}
        </UiAlertDialogTitle>
        <UiAlertDialogDescription>
          {{ $t("deletion.transaction.description") }}
          <template v-if="transaction">
            <div class="mt-2 font-medium text-foreground italic">
              {{ transaction.transaction_date }} — {{ transaction.amount }}
            </div>
          </template>
        </UiAlertDialogDescription>
      </UiAlertDialogHeader>

      <UiAlertDialogFooter>
        <UiAlertDialogCancel :disabled="isDeleting">
          {{ $t("common.cancel") }}
        </UiAlertDialogCancel>
        <UiAlertDialogAction
          class="bg-destructive text-white hover:bg-destructive/90"
          :disabled="isDeleting"
          @click="handleConfirm"
        >
          <Loader2 v-if="isDeleting" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t("deletion.confirm") }}
        </UiAlertDialogAction>
      </UiAlertDialogFooter>
    </UiAlertDialogContent>
  </UiAlertDialog>
</template>
