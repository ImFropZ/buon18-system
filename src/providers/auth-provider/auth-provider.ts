"use client";

import { LoginForm } from "@models/auth";
import type { Me, Login } from "@providers";
import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
  login: async ({ email, password }: LoginForm) => {
    const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/login", { email, password })
      .then(res => res.data)
      .catch(err => err.response.data);

    if (response.code !== 200) {
      return {
        success: false,
        error: {
          name: "Login Error",
          message: response.message,
        },
      };
    }

    // Store in cookies
    const { token, refresh_token } = response.data as Login;
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
      const result = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/me")
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (result.code !== 200) {
        return null;
      }

      return result.data.user.role;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    if (auth) {
      const result = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/me")
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (result.code !== 200) {
        return null;
      }

      return result.data.user satisfies Me;
    }
    return null;
  },
  onError: async (err) => {
    if (err.response.status === 401) {
      Cookies.remove("auth", { path: "/" });
      return {
        logout: true,
        redirectTo: "/login",
      };
    }
    return {}
  },
};
