import { Pagination } from "@nextui-org/react";

interface PaginationComponentProps {
  totalItems: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({
  totalItems,
  perPage,
  currentPage,
  onPageChange,
}: PaginationComponentProps) {
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={onPageChange}
        variant="light"
        color="secondary"
      />
    </div>
  );
}
