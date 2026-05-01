<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import axios from "axios";
import { useForm } from "vee-validate";
import * as z from "zod";

const { t } = useI18n();
const { login, isProcessing, error } = useAuth();

const formSchema = toTypedSchema(
  z.object({
    login: z
      .string()
      .min(1, t("validation.required"))
      .min(3, t("validation.too_short"))
      .max(50, t("validation.too_long")),

    password: z
      .string()
      .min(1, t("validation.required"))
      .min(8, t("validation.password_min"))
      .max(100, t("validation.too_long")),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

watch(error, (newError) => {
  // axios.isAxiosError — це вбудована функція-запобіжник (Type Guard)
  if (axios.isAxiosError(newError)) {
    if (newError.response?.status === 401) {
      form.setErrors({
        login: " ",
        password: t("api.messages.invalid_credentials"),
      });
    }
  }
});

const onSubmit = form.handleSubmit((values) => {
  login(values);
});
useHead({
  title: t("routes.log"),
});
</script>

<template>
  <div class="bg-main flex h-full flex-col items-center justify-center px-4">
    <div class="fixed top-6 right-6">
      <LanguageSwitcher />
    </div>

    <form
      class="bg-section w-full max-w-md rounded-2xl p-8 shadow-md"
      @submit="onSubmit"
    >
      <h1
        class="mb-6 flex items-center justify-center gap-3 text-2xl font-bold"
      >
        <img src="~/assets/images/logo.svg" alt="Logo" class="h-8 w-8" />
        <span class="text-txt-main">{{ t("login.title") }}</span>
      </h1>

      <div class="mb-6 space-y-4">
        <UiFormField v-slot="{ componentField }" name="login">
          <UiFormItem>
            <UiFormControl>
              <UiInput
                type="text"
                :placeholder="t('login.placeholders.login')"
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
                :placeholder="t('login.placeholders.password')"
                v-bind="componentField"
              />
            </UiFormControl>
            <UiFormMessage />
          </UiFormItem>
        </UiFormField>
      </div>

      <UiButton type="submit" :disabled="isProcessing" class="w-full">
        {{ isProcessing ? "..." : t("login.login_btn") }}
      </UiButton>

      <div class="mt-4 text-center">
        {{ t("login.no_account") }}
        <NuxtLinkLocale
          to="/register"
          class="ml-1 text-accent-dark underline-offset-4 hover:underline"
        >
          {{ t("login.register_link") }}
        </NuxtLinkLocale>
      </div>
    </form>
  </div>
</template>
