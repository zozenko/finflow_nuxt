/**
 * @vitest-environment happy-dom
 */
import { setActivePinia, createPinia } from "pinia";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./useAuthStore";

vi.stubGlobal("useLocalePath", () => vi.fn((path) => path));
vi.stubGlobal("navigateTo", vi.fn());

describe("Auth Store (Стор автентифікації)", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockUser = { id: 1, name: "Олександр", email: "alex@example.com" };
  const mockToken = "test-token-123";

  it("початковий стан має бути порожнім, якщо localStorage чистий", () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("має завантажувати дані з localStorage при ініціалізації", () => {
    localStorage.setItem("auth_token", mockToken);
    localStorage.setItem("auth_user", JSON.stringify(mockUser));

    const store = useAuthStore();
    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe(mockToken);
    expect(store.isAuthenticated).toBe(true);
  });

  it("setAuth має коректно оновлювати стан та localStorage", () => {
    const store = useAuthStore();
    store.setAuth({ user: mockUser, token: mockToken });

    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe(mockToken);
    expect(localStorage.getItem("auth_token")).toBe(mockToken);
    expect(JSON.parse(localStorage.getItem("auth_user")!)).toEqual(mockUser);
  });

  it("clearAuth має видаляти всі дані та робити редирект на логін", () => {
    const store = useAuthStore();

    store.setAuth({ user: mockUser, token: mockToken });
    store.clearAuth();

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();

    expect(navigateTo).toHaveBeenCalledWith("/login");
  });

  it("має обробляти помилки JSON у localStorage", () => {
    localStorage.setItem("auth_user", "{ bad-json }");
    const store = useAuthStore();

    expect(store.user).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });
});
