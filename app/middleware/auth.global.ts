import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const publicRoutes = ["login", "register"];
  const routeName = to.name?.toString().split("___")[0] || "";
  const isPublicRoute = publicRoutes.includes(routeName);

  if (!authStore.isAuthenticated && !isPublicRoute) {
    const localePath = useLocalePath();
    return navigateTo(localePath("/login"));
  }

  if (authStore.isAuthenticated && isPublicRoute) {
    const localePath = useLocalePath();
    return navigateTo(localePath("/"));
  }
});
