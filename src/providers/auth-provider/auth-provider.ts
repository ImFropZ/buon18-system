"use client";

import type { Response } from "@models";
import type { Me, Login } from "@providers";
import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await fetch("http://localhost:8080/login", {
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
    const { token, refreshToken } = response;
    const auth = JSON.stringify({ token, refreshToken });
    Cookies.set("auth", auth, { path: "/" });

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
      const profile = await fetch("http://localhost:8080/me")
        .then((res) => res.json())
        .then((data: Response<Me>) => data.data)
        .catch((err) => {
          console.error("GET PERMISSIONS:" + err);
        });

      if (profile == null) {
        return null;
      }

      return profile.role;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const profile = await fetch("http://localhost:8080/me")
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
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
