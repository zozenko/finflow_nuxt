<template>
  <footer class="shrink-0">
    <div
      class="max-w-content mx-auto flex items-center justify-center h-10 text-center px-4"
    >
      <p class="text-sm text-txt-main opacity-70">
        &copy; {{ new Date().getFullYear() }} FinFlow.
        {{ $t("footer.made_by") }}
        <span class="font-medium">Alexandr Zozenko</span>
      </p>
    </div>
  </footer>
</template>
