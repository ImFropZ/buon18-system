import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
          <Button size="icon" variant="outline" disabled={!hasPreviousPage}>
            <ChevronLeft />
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
          <Button size="icon" variant="outline" disabled={!hasNextPage}>
            <ChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
