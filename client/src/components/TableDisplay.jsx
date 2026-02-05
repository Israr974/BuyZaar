import React from 'react'
import SubCategory from '../pages/SubCategory'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const TableDisplay = ({data,column}) => {
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns:column,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
     <div className="p-2">
      <table className='w-full'>
        <thead className='bg-black text-white'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <th>Sr. No.</th>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='border'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row,index) => (
           
            <tr key={row.id}>
               <td>{index+1}</td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='py-1 px-2'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
       
      </table>
      <div className="h-4" />

    </div>
    
  )
}

export default TableDisplay