"use client";

import type { Response } from "@models";
import { LoginForm } from "@models/auth";
import type { Me, Login } from "@providers";
import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: LoginForm) => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data: Response<Login>) => data.data)
      .catch((err) => {
        console.error(err);
      });

    if (response == null) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid username or password",
        },
      };
    }

    // Store in cookies
    const { token, refresh_token } = response;
    const auth = JSON.stringify({ token });
    Cookies.set("auth", auth, { path: "/" });
    localStorage.setItem("refresh-token", refresh_token);

    return {
      success: true,
      redirectTo: "/",
    };
  },
  logout: async () => {
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const profile = await fetch(process.env.NEXT_PUBLIC_API_URL + "/me")
        .then((res) => res.json())
        .then((data: Response<{ user: Me }>) => data.data)
        .catch((err) => {
          console.error("GET PERMISSIONS:" + err);
        });

      if (profile == null) {
        return null;
      }

      return profile.user.role;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const profile = await fetch(process.env.NEXT_PUBLIC_API_URL + "/me")
        .then((res) => res.json())
        .then((data: Response<Me>) => data.data)
        .catch((err) => {
          console.error("GET INDENTITY:" + err);
        });

      if (profile == null) {
        return null;
      }

      return profile;
    }
    return null;
  },
  onError: async (error) => {
    const refreshToken = localStorage.getItem("refresh-token");
    const auth = Cookies.get("auth") || "";
    const { token } = JSON.parse(auth);

    if (!token) {
      return { logout: true };
    }

    if (error.response?.status === 401) {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).then(res => res.json())

      if (response.code > 399) {
        return { logout: true };
      }

      const { token: newToken } = response.data;

      Cookies.set("auth", JSON.stringify({ token: newToken }), { path: "/" });

      // NOTED: using browser reload is not a good practice but it's the only way to refresh page and use new token with api
      window.location.reload();

      return {};
    }

    return { error };
  },
};
