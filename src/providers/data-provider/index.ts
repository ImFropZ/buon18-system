"use client";

import { Response } from "@models";
import { Account } from "@models/account";
import { DataProvider, HttpError } from "@refinedev/core";
import axios from "axios";
import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);

export const dataProvider: DataProvider = {
    getList: async function ({ resource, pagination, sorters, meta }) {
        const auth = Cookies.get("auth");
        const { token } = JSON.parse(auth || "{}");

        if (!token) {
            return {
                data: [],
                total: 0,
            };
        }

        const result = await axiosInstance.get<Response<{ "total": number, "accounts": Account[] }>>(`${API_URL}/${resource}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.data);

        return {
            data: result.data.accounts || [],
            total: result.data.total || 0,
        } as any;
    },
    create: async function ({ resource, variables, meta }) {
        throw new Error("Method not implemented.");
    },
    update: async function ({ resource, id, variables, meta }) {
        throw new Error("Method not implemented.");
    },
    deleteOne: async function ({ resource, id, variables, meta }) {
        throw new Error("Method not implemented.");
    },
    getOne: async function ({ resource, id, meta }) {
        const auth = Cookies.get("auth");
        const { token } = JSON.parse(auth || "{}");

        if (!token) {
            return {
                data: [],
                total: 0,
            };
        }

        const result = await axiosInstance.get<Response<{ "total": number, "account": Account }>>(`${API_URL}/${resource}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => response.data);

        return {
            data: result.data.account
        } as any;
    },
    getApiUrl: function () { return API_URL; },
} 
