<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const { t } = useI18n();
const { register, isProcessing, error } = useAuth();

const formSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: t("validation.required") })
        .min(1, t("validation.required"))
        .min(2, t("validation.too_short"))
        .max(50, t("validation.too_long")),

      email: z
        .string({ required_error: t("validation.required") })
        .min(1, t("validation.required"))
        .email(t("validation.invalid_email")),

      password: z
        .string({ required_error: t("validation.required") })
        .min(1, t("validation.required"))
        .min(8, t("validation.password_min"))
        .max(100, t("validation.too_long"))
        .regex(/[A-Z]/, t("validation.password_uppercase"))
        .regex(/[0-9]/, t("validation.password_number")),

      password_confirmation: z
        .string({ required_error: t("validation.required") })
        .min(1, t("validation.required")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("validation.passwords_mismatch"),
      path: ["password_confirmation"],
    }),
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  register(values);
});

useHead({
  title: t("routes.reg"),
});
</script>

<template>
  <div
    class="bg-main flex min-h-screen flex-col items-center justify-center px-4"
  >
    <div class="fixed top-6 right-6">
      <LanguageSwitcher />
    </div>

    <form
      @submit="onSubmit"
      class="bg-section w-full max-w-md rounded-2xl p-8 shadow-md"
    >
      <h1
        class="mb-6 flex items-center justify-center gap-3 text-2xl font-bold"
      >
        <img src="~/assets/images/logo.svg" alt="Logo" class="h-8 w-8" />
        <span class="text-txt-main tracking-tight">{{
          t("register.title")
        }}</span>
      </h1>

      <div class="mb-6 space-y-4">
        <UiFormField v-slot="{ componentField }" name="name">
          <UiFormItem>
            <UiFormControl>
              <UiInput
                type="text"
                :placeholder="t('register.placeholders.name')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="email">
          <UiFormItem>
            <UiFormControl>
              <UiInput
                type="email"
                :placeholder="t('register.placeholders.email')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="password">
          <UiFormItem>
            <UiFormControl>
              <UiInput
                type="password"
                :placeholder="t('register.placeholders.password')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>

        <UiFormField v-slot="{ componentField }" name="password_confirmation">
          <UiFormItem>
            <UiFormControl>
              <UiInput
                type="password"
                :placeholder="t('register.placeholders.confirm_password')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>

      <div
        v-if="error"
        class="mb-4 text-center text-sm font-medium text-destructive"
      >
        {{ error }}
      </div>

      <UiButton type="submit" :disabled="isProcessing" class="w-full">
        {{ isProcessing ? "..." : t("register.register_btn") }}
      </UiButton>

      <div class="mt-4 text-center text-txt-main">
        {{ t("register.have_account") }}
        <NuxtLinkLocale
          to="/login"
          class="ml-1 text-accent-dark underline-offset-4 hover:underline"
        >
          {{ t("register.login_link") }}
        </NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>
