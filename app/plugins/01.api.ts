import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

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
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
      return Promise.reject(error);
    },
  );

  return {
    provide: { api },
  };
});
