import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageNumber: number;
  countOfItems: number;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  setCurrentPageNumber: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  pageNumber,
  countOfItems,
  setCurrentPageNumber,
  pageSize,
  setPageSize,
}: PaginationProps) {
  const [numberOfPages, setNumberOfPages] = useState<number>(5);

  useEffect(() => {
    const numberOfPages = Math.ceil(countOfItems / pageSize);
    setNumberOfPages(numberOfPages);
  }, [countOfItems, pageSize]);

  const handlePageChange = (event: { selected: number }) => {
    const currentPageNumber = event.selected + 1;
    setCurrentPageNumber(currentPageNumber);
  };
  return (
    <div className="d-flex flex-column flex-lg-row gap-5 justify-content-center  mt-5 w-100">
      {countOfItems > 0 && (
        <select
          className="rounded px-4  d-block "
          style={{
            height: "30px",
            maxWidth: "100px",
          }}
          name="pageSize"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      )}

      <ReactPaginate
        forcePage={pageNumber - 1}
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageChange}
        pageCount={numberOfPages}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName="list-unstyled d-flex justify-content-center text-decoration-none text-black"
        pageLinkClassName="py-2 px-3 border border-1 border-dark mx-2 cursor-pointer text-decoration-none text-black"
        nextLinkClassName="text-decoration-none text-black ms-5 cursor-pointer "
        previousLinkClassName="text-decoration-none text-black me-5 cursor-pointer r"
        breakLinkClassName="text-decoration-none text-black"
        activeLinkClassName="bg-primary text-white"
      />
    </div>
  );
}
