import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-04-14",

  future: {
    compatibilityVersion: 4,
  },

  ssr: false,

  devtools: { enabled: true },

  modules: ["@pinia/nuxt", "@nuxtjs/i18n", , "shadcn-nuxt"],

  i18n: {
    locales: [
      { code: "uk", iso: "uk-UA", name: "Ukrainian" },
      { code: "en", iso: "en-US", name: "English" },
    ],
    defaultLocale: "uk",
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/main.css"],

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL as string,
    },
  },
});
