"use client";

import { Response } from "@models";
import { DataProvider } from "@refinedev/core";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const dataProvider: DataProvider = {
    getList: async function ({ resource, pagination, sorters, meta }) {
        const auth = Cookies.get("auth");
        const { token } = JSON.parse(auth || "{}");

        const resources = await fetch(`${API_URL}/${resource}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((data) => data.data)
            .catch((err) => {
                return {
                    total: 0,
                    data: [] as any[],
                };
            })

        return {
            data: resources[resource] || [],
            total: resources.total || 0,
        };
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
        throw new Error("Method not implemented.");
    },
    getApiUrl: function () { return API_URL; },
} 
