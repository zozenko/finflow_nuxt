<script setup lang="ts">
import { computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import type { Color } from "reka-ui";

const props = defineProps<{
  isOpen: boolean;
  editData?: { id: number; name: string; icon_key: string } | null;
}>();

const color = ref("#34d399");
const emit = defineEmits(["update:isOpen", "success"]);
const isEditMode = computed(() => !!props.editData);
const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, "Назва має містити мінімум 2 символи").max(50),
    icon_key: z.string().min(1, "Оберіть іконку"),
  }),
);

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: props.editData || { name: "", icon_key: "" },
});

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
    if (isEditMode.value) {
      // Виклик API для оновлення (PATCH/PUT)
      // await updateCategory(props.editData!.id, values);
      console.log("Оновлюємо:", props.editData!.id, values);
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
    <UiDialogContent class="sm:max-w-106">
      <UiDialogHeader>
        <UiDialogTitle>
          {{ isEditMode ? "Редагувати категорію" : "Створити нову категорію" }}
        </UiDialogTitle>
        <UiDialogDescription>
          {{
            isEditMode
              ? "Внесіть зміни та збережіть."
              : "Заповніть поля нижче, щоб додати категорію."
          }}
        </UiDialogDescription>
      </UiDialogHeader>

      <form @submit="onSubmit" class="space-y-4">
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem>
            <UiFormLabel>Назва</UiFormLabel>
            <UiFormControl>
              <UiInput
                placeholder="Наприклад: Продукти"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="icon_key">
          <UiFormItem>
            <UiFormLabel>Іконка</UiFormLabel>
            <UiFormControl>
              <UiInput
                placeholder="Наприклад: ShoppingBasket"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <HueSlider v-model="color" />

        <p>Обраний колір: {{ color }}</p>
        <div :style="{ backgroundColor: color }">dfsd</div>

        <UiDialogFooter class="pt-4">
          <UiButton type="submit">
            {{ isEditMode ? "Зберегти зміни" : "Створити" }}
          </UiButton>
        </UiDialogFooter>
      </form>
    </UiDialogContent>
  </UiDialog>
</template>
