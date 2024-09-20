import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@components/ui/pagination";
import React from "react";
import { Button } from "./ui/button";

interface CustomPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  back: () => void;
  next: () => void;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function CustomPagination({
  back,
  next,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  ...props
}: CustomPaginationProps) {
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem
          onClick={() => {
            back();
          }}
        >
          <Button variant="outline" disabled={!hasPreviousPage}>
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem
          onClick={() => {
            next();
          }}
        >
          <Button variant="outline" disabled={!hasNextPage}>
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
