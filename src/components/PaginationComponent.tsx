import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface PaginationComponentProps {
  totalItems: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({
  totalItems,
  perPage,
  currentPage = 1,
  onPageChange,
}: PaginationComponentProps) {
  const totalPages = Math.ceil(totalItems / perPage);
  const [localPage, setLocalPage] = useState(currentPage);

  const handleChange = (page: number) => {
    setLocalPage(page);
    onPageChange(page);
  };

  useEffect(() => {
    setLocalPage(currentPage);
  }, [currentPage]);

  console.log(currentPage);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Pagination
        key={`pagination-${localPage}-${totalPages}`}
        total={totalPages}
        page={localPage}
        onChange={handleChange}
        variant="light"
        color="secondary"
      />
    </div>
  );
}
