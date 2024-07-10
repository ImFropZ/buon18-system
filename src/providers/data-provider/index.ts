"use client";

import { Response } from "@models";
import { Account } from "@models/account";
import { DataProvider } from "@refinedev/core";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

axiosInstance.interceptors.request.use(async req => {
    const token = getAuthCookie();
    if (!token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    const decodedExpToken = jwtDecode(token).exp;
    const isExpired = decodedExpToken ? decodedExpToken < Date.now() / 1000 : true;

    if (isExpired) {
        const refreshToken = localStorage.getItem("refresh-token");
        if (!refreshToken || !token) {
            return Promise.reject("Unauthorized");
        }

        const result = await axios.post(`${API_URL}/refresh`, {
            refresh_token: refreshToken,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        if (result.status !== 200) {
            return Promise.reject("Unauthorized");
        }

        const { token: newToken, refresh_token } = result.data.data;

        console.log(newToken, refreshToken)

        Cookies.set("auth", JSON.stringify({ token: newToken }), { path: "/" });
        localStorage.setItem("refresh-token", refresh_token);

        req.headers.Authorization = `Bearer ${newToken}`;
    }

    return req;
})

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
);

export const dataProvider: DataProvider = {
    getList: async function ({ resource, pagination, sorters, meta }) {
        const token = getAuthCookie();

        const result = await axiosInstance.get<Response<{ "total": number, "accounts": Account[] }>>(`/${resource}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                ...(meta?.filters?.q ? { q: meta?.filters?.q } : {}),
                ...(pagination ? { limit: pagination.pageSize, offset: (pagination.pageSize || 10) * ((pagination.current || 1) - 1) } : {}),
            },
        }).then((response) => response.data);

        return {
            data: result.data.accounts || [],
            total: result.data.total || 0,
        } as any;
    },
    create: async function ({ resource, variables, meta }) {
        const token = getAuthCookie();

        await axiosInstance.post<Response<{ [key in string]: object }>>(`/${resource}`, variables, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.data);

        const { data, total } = await this.getList({ resource, meta });

        return {
            data,
            total
        } as any;
    },
    update: async function ({ resource, id, variables, meta }) {
        const token = getAuthCookie();

        await axiosInstance.patch<Response<{ [key in string]: object }>>(`/${resource}/${id}`, variables, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.data);

        const { data } = await this.getOne({ resource, id, meta })

        return {
            data,
        } as any;
    },
    deleteOne: async function ({ resource, id, variables, meta }) {
        const token = getAuthCookie();

        const response = await axiosInstance.delete<Response<{ [key in string]: object }>>(`/${resource}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status !== 200) {
            throw new Error("Failed to delete the account");
        }

        const { data, total } = await this.getList({ resource, meta });

        return {
            data,
            total
        } as any;
    },
    getOne: async function ({ resource, id, meta }) {
        const token = getAuthCookie();

        const result = await axiosInstance.get<Response<{ [key in string]: object }>>(`/${resource}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.data);

        // Remove the last character from the resource name ussuallly 's'
        const tmpResource = resource.split("");
        tmpResource.pop();
        resource = tmpResource.join("");

        return {
            data: result.data[resource] || {} // Remove the last character from the resource name ussuallly 's'
        } as any;
    },
    getApiUrl: function () { return API_URL; },
}

function getAuthCookie() {
    const auth = Cookies.get("auth");
    const { token } = JSON.parse(auth || "{}");

    if (!token) {
        throw new Error("Unauthorized");
    }

    return token;
}