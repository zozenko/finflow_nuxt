import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  return {
    provide: {
      queryClient,
    },
  };
});
