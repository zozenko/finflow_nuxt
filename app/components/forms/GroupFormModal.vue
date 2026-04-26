<script setup lang="ts">
import { computed, watch } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CreateGroupSchema, type CreateGroupData } from "~/types";
import z from "zod";

const props = defineProps<{
  isOpen: boolean;
  editData?: (CreateGroupData & { id: number }) | null;
}>();

const emit = defineEmits(["update:isOpen", "success"]);

const { t } = useI18n();
const formSchema = computed(() =>
  toTypedSchema(
    CreateGroupSchema.extend({
      name: z
        .string({ required_error: t("validation.required") })
        .min(2, t("validation.name_min_2"))
        .max(50, t("validation.name_max_50")),
      icon_key: z.string().min(1, t("validation.icon_required")),
    }),
  ),
);

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: props.editData || {
    name: "",
    icon_key: "",
    color: "#34d399",
  },
});

const isEditMode = computed(() => !!props.editData);

// Спостерігаємо за змінами props.editData
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      setValues(newData);
    } else {
      resetForm();
    }
  },
);

const onSubmit = handleSubmit(async (values) => {
  try {
    if (isEditMode.value && props.editData) {
      // Виклик API для оновлення (PATCH/PUT)
      // await updateCategory(props.editData.id, values);
      console.log("Оновлюємо:", props.editData.id, values);
    } else {
      // Виклик API для створення (POST)
      // await createCategory(values);
      console.log("Створюємо нову:", values);
    }

    emit("update:isOpen", false);
    emit("success");
    resetForm();
  } catch (error) {
    console.error("Помилка збереження", error);
  }
});
</script>

<template>
  <UiDialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
    <UiDialogContent class="sm:max-w-md">
      <UiDialogHeader>
        <UiDialogTitle>
          {{
            isEditMode ? t("category.edit_title") : t("category.create_title")
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

      <form @submit="onSubmit" class="space-y-4">
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem>
            <UiFormLabel>{{ t("form.name_label") }}</UiFormLabel>
            <UiFormControl>
              <UiInput
                :placeholder="t('form.name_placeholder')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="icon_key">
          <UiFormItem>
            <UiFormLabel>{{ t("form.icon_label") }}</UiFormLabel>
            <UiFormControl>
              <IconPicker v-bind="componentField" />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField, value }" name="color">
          <UiFormItem>
            <UiFormLabel>{{ t("form.color_label") }}</UiFormLabel>
            <UiFormControl>
              <HueSlider
                v-bind="componentField"
                :model-value="value"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiDialogFooter class="pt-4">
          <UiButton type="submit">
            {{ isEditMode ? t("common.save_changes") : t("common.create") }}
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
