import { useState } from "react";

export interface UsePaginationParams {
    pageSize: number; // Number of items shown per page
    totalItems: number; // Number of items
    page: number; // Init page number
    onChange?: (page: number, {
        pageSize,
        totalItems
    }: {
        pageSize: number;
        totalItems: number;
    }) => void;
}

export interface UsePaginationResult {
    totalPage: number;
    pageSize: number;
    currentPage: number;
    next(toLast?: boolean): void;
    back(toFirst?: boolean): void;
    go(page: number): void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export function usePagination({
    pageSize,
    totalItems,
    page,
    onChange
}: UsePaginationParams) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const initPage = totalPages - Math.abs(page) < 0 ? 1 : page < 0 ? 1 : page;
    const [currentPage, setCurrentPage] = useState(initPage);

    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    const next = (toLast = false) => {
        if (toLast) {
            onChange && onChange(totalPages, {
                pageSize,
                totalItems
            });
            setCurrentPage(totalPages);
        } else if (hasNextPage) {
            onChange && onChange(currentPage + 1, {
                pageSize,
                totalItems
            });
            setCurrentPage(currentPage + 1);
        }
    };

    const back = (toFirst = false) => {
        if (toFirst) {
            onChange && onChange(1, {
                pageSize,
                totalItems
            });
            setCurrentPage(1);
        } else if (hasPreviousPage) {
            onChange && onChange(currentPage - 1, {
                pageSize,
                totalItems
            });
            setCurrentPage(currentPage - 1);
        }
    };

    const go = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onChange && onChange(page, {
                pageSize,
                totalItems
            });
            setCurrentPage(page);
        }
    };

    return {
        totalPage: totalPages,
        pageSize,
        currentPage,
        next,
        back,
        go,
        hasNextPage,
        hasPreviousPage,
    };
}