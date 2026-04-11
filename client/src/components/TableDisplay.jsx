import React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Search } from 'lucide-react'

const TableDisplay = ({ data = [], columns = [], title, showPagination = true, pageSize = 10 }) => {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  })

  // Safety check: if columns is empty or not provided
  if (!columns || columns.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <p className="text-text-muted">Loading table data...</p>
      </div>
    )
  }

  // Safety check: ensure data is an array
  const safeData = Array.isArray(data) ? data : []

  const table = useReactTable({
    data: safeData,
    columns: columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header with Title and Search */}
      {title && (
        <div className="p-4 border-b border-border bg-bg-alt/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-text">{title}</h2>
            
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={16} />
              <input
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search all columns..."
                className="input pl-9 py-2 text-sm w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-alt border-b border-border">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted border-r border-border w-12">
                  #
                </th>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3 text-left text-sm font-semibold text-text-muted border-r border-border last:border-r-0"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() 
                            ? 'cursor-pointer select-none flex items-center gap-1 hover:text-primary transition-colors' 
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <ArrowUpDown size={14} className="text-text-muted" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-4 py-12 text-center text-text-muted"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search size={48} className="text-border" />
                    <p>No data available</p>
                    {globalFilter && (
                      <button
                        onClick={() => setGlobalFilter('')}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr 
                  key={row.id} 
                  className="border-b border-border hover:bg-bg-alt/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-text-muted border-r border-border">
                    {index + 1 + pagination.pageIndex * pagination.pageSize}
                   </td>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-text border-r border-border last:border-r-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && safeData.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-bg-alt/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-muted">
            Showing {table.getRowModel().rows.length} of {safeData.length} entries
          </div>
          
          <div className="flex items-center gap-2">
            {/* First Page */}
            <button
              className="p-2 rounded-lg border border-border hover:bg-card hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            
            {/* Previous Page */}
            <button
              className="p-2 rounded-lg border border-border hover:bg-card hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                let pageNum;
                const currentPage = table.getState().pagination.pageIndex;
                const totalPages = table.getPageCount();
                
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage <= 2) {
                  pageNum = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      table.getState().pagination.pageIndex === pageNum
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-border hover:bg-card hover:border-primary text-text-muted hover:text-primary'
                    }`}
                    onClick={() => table.setPageIndex(pageNum)}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            {/* Next Page */}
            <button
              className="p-2 rounded-lg border border-border hover:bg-card hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            
            {/* Last Page */}
            <button
              className="p-2 rounded-lg border border-border hover:bg-card hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
          
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Show</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="input py-1 px-2 text-sm w-auto"
            >
              {[10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableDisplay