<script setup lang="ts">
import { Star } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { CreateTransactionSchema, type Transaction } from "~/types";

const props = defineProps<{
  isOpen: boolean;
  editData?: Transaction | null;
}>();

const emit = defineEmits(["update:isOpen"]);
const { t } = useI18n();

const { addTransaction, updateTransaction, getTransactionById } =
  useTransactions();
const { accounts } = useAccounts();
const { groups } = useGroups();
const { getCategoriesByGroupId } = useCategories();

const parentId = computed(() => props.editData?.parent_id ?? null);
const { data: parentTransaction } = getTransactionById(parentId);

const resolvedEditData = computed(() =>
  parentTransaction.value
    ? { ...parentTransaction.value, id: parentTransaction.value.id }
    : props.editData,
);

const formSchema = computed(() =>
  toTypedSchema(
    CreateTransactionSchema.extend({
      title: z
        .string({ required_error: t("validation.required") })
        .min(1, t("validation.required")),
      amount: z.coerce
        .number({
          required_error: t("validation.required"),
          invalid_type_error: t("validation.required"),
        })
        .min(0.01, t("validation.amount_min")),
      transaction_date: z.string({ required_error: t("validation.required") }),
      account_id: z.coerce.number({
        required_error: t("validation.required"),
        invalid_type_error: t("validation.required"),
      }),
      to_account_id: z.preprocess(
        (val) => (val === undefined ? null : val),
        z.coerce
          .number({ invalid_type_error: t("validation.required") })
          .nullable(),
      ),
      group_id: z.preprocess(
        (val) => (val === undefined ? null : val),
        z.coerce
          .number({ invalid_type_error: t("validation.required") })
          .nullable(),
      ),
      category_id: z.preprocess(
        (val) => (val === undefined ? null : val),
        z.coerce
          .number({ invalid_type_error: t("validation.required") })
          .nullable(),
      ),
    }).refine(
      (data) => data.type !== "transfer" || data.to_account_id != null,
      {
        message: t("validation.required"),
        path: ["to_account_id"],
      },
    ),
  ),
);

const formatForDateTimeLocal = (dateInput?: string | null) => {
  if (!dateInput) {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
  return dateInput.replace(" ", "T").slice(0, 16);
};

const { handleSubmit, resetForm, setValues, values, errors } = useForm({
  validationSchema: formSchema,
  initialValues: props.editData || {
    title: "",
    amount: 0,
    type: "expense",
    account_id: undefined,
    to_account_id: null,
    group_id: null,
    category_id: null,
    transaction_date: formatForDateTimeLocal(),
    is_favorite: false,
    description: null,
  },
});

const isEditMode = computed(() => !!resolvedEditData.value);

watch(resolvedEditData, (newData) => {
  if (newData)
    setValues({
      ...newData,
      transaction_date: formatForDateTimeLocal(newData.transaction_date),
    });
  else resetForm();
});

watch(
  () => values.type,
  (newType, oldType) => {
    if (newType === "transfer" && oldType !== "transfer") {
      setValues({ group_id: null, category_id: null });
    } else if (newType !== "transfer" && oldType === "transfer") {
      setValues({ to_account_id: null });
    }
  },
);

const onSubmit = handleSubmit(async (formValues) => {
  try {
    if (isEditMode.value && resolvedEditData.value) {
      updateTransaction({ id: resolvedEditData.value.id, payload: formValues });
    } else {
      addTransaction(formValues);
    }
    emit("update:isOpen", false);
    resetForm();
  } catch (error) {
    console.error("Transaction save error:", error);
  }
});

const transactionTypes = computed(() => [
  { value: "expense", label: t("transaction.type.expense") },
  { value: "income", label: t("transaction.type.income") },
  { value: "transfer", label: t("transaction.type.transfer") },
]);

const filteredCategories = computed(() => {
  if (values.group_id == null) {
    return [];
  }
  return getCategoriesByGroupId(Number(values.group_id)).value;
});
</script>

<template>
  <UiDialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <UiDialogContent class="sm:max-w-md">
      <UiDialogHeader>
        <UiDialogTitle>
          {{
            isEditMode
              ? t("transaction.edit_title")
              : t("transaction.create_title")
          }}
        </UiDialogTitle>
        <UiDialogDescription>
          {{
            isEditMode
              ? t("common.edit_instructions")
              : t("common.create_instructions")
          }}
        </UiDialogDescription>
      </UiDialogHeader>

      <form class="flex flex-col gap-4" @submit="onSubmit">
        <UiFormField v-slot="{ componentField }" name="title">
          <UiFormItem>
            <UiFormLabel>{{ t("form.name_label") }}</UiFormLabel>
            <UiFormControl>
              <UiInput
                :placeholder="t('transaction.form.title_placeholder')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <div>
          <div class="flex w-full gap-4 items-start">
            <UiFormField v-slot="{ componentField }" name="amount">
              <UiFormItem class="flex-1">
                <UiFormLabel>{{
                  t("transaction.form.amount_label")
                }}</UiFormLabel>
                <UiFormControl>
                  <UiInput
                    type="number"
                    step="0.01"
                    min="0"
                    :placeholder="t('transaction.form.amount_placeholder')"
                    v-bind="componentField"
                  />
                </UiFormControl>
              </UiFormItem>
            </UiFormField>

            <UiFormField v-slot="{ componentField }" name="type">
              <UiFormItem class="flex-1">
                <UiFormLabel>{{
                  t("transaction.form.type_label")
                }}</UiFormLabel>
                <UiSelect v-bind="componentField">
                  <UiFormControl>
                    <UiSelectTrigger class="w-full">
                      <UiSelectValue
                        :placeholder="t('transaction.form.type_placeholder')"
                      />
                    </UiSelectTrigger>
                  </UiFormControl>
                  <UiSelectContent>
                    <UiSelectItem
                      v-for="type in transactionTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </UiFormItem>
            </UiFormField>
          </div>

          <div
            v-if="errors.amount || errors.type"
            class="text-sm text-destructive mt-2"
          >
            {{ errors.amount || errors.type }}
          </div>
        </div>

        <div>
          <div
            class="flex flex-col gap-4"
            :class="{ 'sm:flex-row w-full': values.type === 'transfer' }"
          >
            <UiFormField v-slot="{ componentField }" name="account_id">
              <UiFormItem class="flex-1">
                <UiFormLabel>
                  {{
                    values.type === "transfer"
                      ? t("transaction.form.from_account_label")
                      : t("transaction.form.account_label")
                  }}
                </UiFormLabel>
                <UiSelect v-bind="componentField">
                  <UiFormControl>
                    <UiSelectTrigger class="w-full">
                      <UiSelectValue
                        :placeholder="t('transaction.form.account_placeholder')"
                      />
                    </UiSelectTrigger>
                  </UiFormControl>
                  <UiSelectContent>
                    <UiSelectItem
                      v-for="acc in accounts"
                      :key="acc.id"
                      :value="acc.id"
                    >
                      {{ acc.name }}
                    </UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </UiFormItem>
            </UiFormField>
            <UiFormField
              v-if="values.type === 'transfer'"
              v-slot="{ componentField }"
              name="to_account_id"
            >
              <UiFormItem class="flex-1">
                <UiFormLabel>{{
                  t("transaction.form.to_account_label")
                }}</UiFormLabel>
                <UiSelect v-bind="componentField">
                  <UiFormControl>
                    <UiSelectTrigger class="w-full">
                      <UiSelectValue
                        :placeholder="
                          t('transaction.form.to_account_placeholder')
                        "
                      />
                    </UiSelectTrigger>
                  </UiFormControl>
                  <UiSelectContent>
                    <UiSelectItem
                      v-for="acc in accounts"
                      :key="acc.id"
                      :value="acc.id"
                    >
                      {{ acc.name }}
                    </UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </UiFormItem>
            </UiFormField>
          </div>
          <div
            v-if="errors.account_id || errors.to_account_id"
            class="text-sm text-destructive mt-2"
          >
            {{ errors.account_id || errors.to_account_id }}
          </div>
        </div>

        <div v-if="values.type !== 'transfer'" class="flex gap-4">
          <UiFormField v-slot="{ componentField }" name="group_id">
            <UiFormItem class="flex-1">
              <UiFormLabel>{{ t("transaction.form.group_label") }}</UiFormLabel>
              <UiSelect v-bind="componentField">
                <UiFormControl>
                  <UiSelectTrigger class="w-full">
                    <UiSelectValue
                      :placeholder="t('transaction.form.group_placeholder')"
                    />
                  </UiSelectTrigger>
                </UiFormControl>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="group in groups"
                    :key="group.id"
                    :value="group.id"
                  >
                    {{ group.name }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ componentField }" name="category_id">
            <UiFormItem class="flex-1">
              <UiFormLabel>{{
                t("transaction.form.category_label")
              }}</UiFormLabel>
              <UiSelect v-bind="componentField" :disabled="!values.group_id">
                <UiFormControl>
                  <UiSelectTrigger class="w-full">
                    <UiSelectValue
                      :placeholder="t('transaction.form.category_placeholder')"
                    />
                  </UiSelectTrigger>
                </UiFormControl>
                <UiSelectContent>
                  <UiSelectItem
                    v-for="cat in filteredCategories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.name }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>
        </div>

        <div class="flex items-end gap-4">
          <UiFormField
            v-slot="{ componentField }"
            name="transaction_date"
            class="flex-1"
          >
            <UiFormItem class="flex-1">
              <UiFormLabel>{{ t("transaction.form.date_label") }}</UiFormLabel>
              <UiFormControl>
                <UiInput type="datetime-local" v-bind="componentField" />
              </UiFormControl>
              <UiFormMessage />
            </UiFormItem>
          </UiFormField>

          <UiFormField v-slot="{ value, handleChange }" name="is_favorite">
            <UiFormItem class="pb-0.5">
              <UiFormControl>
                <UiButton
                  type="button"
                  variant="outline"
                  size="icon"
                  class="bg-background"
                  @click="handleChange(!value)"
                >
                  <Star
                    class="size-6 transition-colors"
                    :class="
                      value
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    "
                  />
                </UiButton>
              </UiFormControl>
            </UiFormItem>
          </UiFormField>
        </div>

        <UiFormField v-slot="{ componentField }" name="description">
          <UiFormItem>
            <UiFormLabel>{{
              t("transaction.form.description_label")
            }}</UiFormLabel>
            <UiFormControl>
              <UiTextarea
                :placeholder="t('transaction.form.description_placeholder')"
                class="resize-none"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter>
          <UiButton type="submit">
            {{ isEditMode ? t("common.save_changes") : t("common.create") }}
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
