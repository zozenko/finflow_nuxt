<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { CreateCategorySchema, type Category } from "~/types";
import z from "zod";

const props = defineProps<{
  isOpen: boolean;
  editData?: Category | null;
}>();

const emit = defineEmits(["update:isOpen"]);

const { updateCategory, addCategory } = useCategories();
const { groups } = useGroups();
const { t } = useI18n();

const formSchema = computed(() =>
  toTypedSchema(
    CreateCategorySchema.extend({
      name: z
        .string({ required_error: t("validation.required") })
        .min(2, t("validation.name_min_2"))
        .max(50, t("validation.name_max_50")),
      icon_key: z.string().min(1, t("validation.icon_required")),
      group_id: z.coerce
        .number({
          required_error: t("validation.required"),
          invalid_type_error: t("validation.required"),
        })
        .min(1, t("validation.required"))
        .nullable(),
    }),
  ),
);

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: formSchema,
  initialValues: props.editData || {
    name: "",
    icon_key: "",
    color: "#00b079",
    group_id: null,
  },
});

const isEditMode = computed(() => !!props.editData);

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
      await updateCategory({ id: props.editData.id, payload: values });
    } else {
      await addCategory(values);
    }

    emit("update:isOpen", false);
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

      <form class="flex flex-col gap-4" @submit="onSubmit">
        <UiFormField v-slot="{ componentField }" name="group_id">
          <UiFormItem>
            <UiFormLabel>{{ t("category.form.group_label") }}</UiFormLabel>
            <UiSelect v-bind="componentField">
              <UiFormControl>
                <UiSelectTrigger class="w-full">
                  <UiSelectValue
                    :placeholder="t('category.form.group_placeholder')"
                  />
                </UiSelectTrigger>
              </UiFormControl>
              <UiSelectContent class="w-full">
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
              <IconPicker
                v-bind="componentField"
                @update:model-value="componentField['onUpdate:modelValue']"
              />
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

        <div>
          <div class="font-medium text-sm">
            {{ t("form.preview_label") }}
          </div>

          <div class="flex items-center gap-3 mt-3 rounded-xl border">
            <div class="flex items-center justify-center p-3">
              <component
                :is="getIcon(values.icon_key)"
                v-if="values.icon_key"
                class="size-8"
                :style="{ color: values.color || '#00b079' }"
              />
              <div
                v-else
                class="size-8 rounded-full bg-white/20 animate-pulse"
              />
            </div>

            <span class="text-lg font-medium truncate">
              {{ values.name || t("category.form.name_placeholder") }}
            </span>
          </div>
        </div>

        <UiDialogFooter>
          <UiButton type="submit">
            {{ isEditMode ? t("common.save_changes") : t("common.create") }}
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
