import { apiRequest } from "@/lib/api";

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginUser(payload: LoginPayload) {
  try {
    const result = await apiRequest<unknown>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return result as { user?: AuthUser; message?: string };
  } catch {
    return { message: "Authentication service is unavailable." };
  }
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const result = await apiRequest<unknown>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return result as { user?: AuthUser; message?: string };
  } catch {
    return { message: "Registration service is unavailable." };
  }
}

export async function logoutUser() {
  try {
    return await apiRequest<unknown>("/auth/logout", { method: "POST" });
  } catch {
    return { message: "Logout service is unavailable." };
  }
}

export async function getCurrentUser() {
  try {
    const result = await apiRequest<unknown>("/auth/me");
    return (result as { user?: AuthUser }).user ?? null;
  } catch {
    return null;
  }
}
