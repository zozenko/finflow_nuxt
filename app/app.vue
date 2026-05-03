<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import "vue-sonner/style.css";
</script>

<template>
  <div class="flex flex-col h-dvh">
    <Header />
    <main class="flex-1">
      <div class="max-w-content h-full mx-auto px-4">
        <NuxtPage />
      </div>
    </main>
    <Footer />
    <UiToaster position="top-center" />
    <Modal />
    <ClientOnly> <VueQueryDevtools /> </ClientOnly>
  </div>
</template>
