import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-04-14",

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      titleTemplate: "%s FinFlow",
    },
  },

  ssr: false,

  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxtjs/i18n", "@nuxt/eslint", "shadcn-nuxt"],

  i18n: {
    locales: [
      { code: "uk", iso: "uk-UA", file: "uk.json" },
      { code: "en", iso: "en-US", file: "en.json" },
    ],
    langDir: "../app/locales",
    defaultLocale: "uk",
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
  },

  build: {
    transpile: [
      "vee-validate",
      "@vee-validate/zod",
      "klona",
      "@tanstack/vue-query-devtools",
      "@vue/devtools-api",
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      include: [
        "vue-i18n",
        "@nuxtjs/i18n",
        "vee-validate",
        "@tanstack/vue-query",
        "axios",
        "@vee-validate/zod",
        "zod",
        "class-variance-authority",
        "reka-ui",
        "@vueuse/core",
        "clsx",
        "tailwind-merge",
        "@unovis/ts",
        "@unovis/vue",
        "lucide-vue-next",
        "@tanstack/vue-query-devtools",
        "@vue/devtools-api",
        "vue-sonner",
        "colord",
      ],
    },
  },

  css: ["~/assets/main.css"],

  runtimeConfig: {
    public: {
      apiUrl: "",
    },
  },
});
