<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { AccountSchema, CreateAccountSchema, type Account } from "~/types";

const props = defineProps<{
  isOpen: boolean;
  editData?: Account | null;
}>();

const emit = defineEmits(["update:isOpen", "success"]);
const { t } = useI18n();

const { addAccount, updateAccount } = useAccounts();

const formSchema = computed(() =>
  toTypedSchema(
    CreateAccountSchema.extend({
      name: z
        .string({ required_error: t("validation.required") })
        .min(2, t("validation.name_min_2"))
        .max(50, t("validation.name_max_50")),
      type: AccountSchema.shape.type,
      currency: z.string().default("UAH"),
      balance: z.coerce.number().default(0),
    }),
  ),
);

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: props.editData || {
    name: "",
    type: "cash",
    currency: "UAH",
    balance: 0,
  },
});

const isEditMode = computed(() => !!props.editData);

watch(
  () => props.editData,
  (newData) => {
    if (newData) setValues(newData);
    else resetForm();
  },
);

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditMode.value && props.editData) {
      updateAccount({ id: props.editData.id, payload: values });
    } else {
      addAccount(values);
    }
    emit("update:isOpen", false);
    emit("success");
    resetForm();
  } catch (error) {
    console.error("Account save error:", error);
  }
});

const accountTypes = computed(() => [
  { value: "cash", label: t("account.type.cash") },
  { value: "card", label: t("account.type.card") },
  { value: "savings", label: t("account.type.savings") },
  { value: "credit", label: t("account.type.credit") },
]);
</script>

<template>
  <UiDialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <UiDialogContent class="sm:max-w-md">
      <UiDialogHeader>
        <UiDialogTitle>
          {{ isEditMode ? t("account.edit_title") : t("account.create_title") }}
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
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem>
            <UiFormLabel>{{ t("form.name_label") }}</UiFormLabel>
            <UiFormControl>
              <UiInput
                :placeholder="t('account.form.name_placeholder')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="type">
          <UiFormItem>
            <UiFormLabel>{{ t("account.form.type_label") }}</UiFormLabel>
            <UiSelect v-bind="componentField">
              <UiFormControl>
                <UiSelectTrigger class="w-full">
                  <UiSelectValue
                    :placeholder="t('account.form.type_placeholder')"
                  />
                </UiSelectTrigger>
              </UiFormControl>
              <UiSelectContent>
                <UiSelectItem
                  v-for="type in accountTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
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
