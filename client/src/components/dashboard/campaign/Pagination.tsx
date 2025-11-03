import { useState } from "react";

const Pagination = ({ data }: { data: any[] }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 rounded-sm mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 dark:text-white p-3">
          <p className="w-7">S/N</p>
          <p>Email</p>
        </div>

        <div className="mt-2 space-y-2">
          {currentItems.map((data, i) => {
            return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 text-accent p-3">
              <p className="w-6">{i+1}</p>
              <p className="break-words">{data.email}</p>
            </div>
            )
          })}   
        </div>
      </div>
      <div className="flex-center gap-2 mt-4 text-accent">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-1 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Pagination