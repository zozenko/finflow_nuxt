import axios from "axios";
import { toast } from "vue-sonner";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { $i18n } = useNuxtApp();
  const t = $i18n.t;

  const api = axios.create({
    baseURL: config.public.apiUrl as string,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request Interceptor
  api.interceptors.request.use(
    (config) => {
      const auth_token = localStorage.getItem("auth_token");
      if (auth_token) {
        config.headers.Authorization = `Bearer ${auth_token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const data = error.response?.data;

      switch (status) {
        case 401: {
          const authStore = useAuthStore();
          authStore.clearAuth();
          toast.warning(t("api.errors.unauthorized"), {
            description: t("api.messages.session_expired"),
          });
          break;
        }

        case 422:
          toast.error(t("api.errors.validation"), {
            description: data?.message || t("api.messages.check_fields"),
          });
          break;

        case 500:
          toast.error(t("api.errors.server"), {
            description: t("api.messages.try_later"),
          });
          break;

        default:
          toast.error(t("api.errors.unknown"), {
            description: error.message || t("api.errors.network"),
          });
      }

      return Promise.reject(error);
    },
  );

  return {
    provide: { api },
  };
});
