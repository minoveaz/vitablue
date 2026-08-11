import React from 'react';

export interface RequirementsComparisonColumn {
  key: string;
  label: React.ReactNode;
  className?: string;
}

export interface RequirementsComparisonRow {
  key: string;
  cells: React.ReactNode[];
  className?: string;
}

export interface RequirementsComparisonTableProps {
  columns: RequirementsComparisonColumn[];
  rows: RequirementsComparisonRow[];
  className?: string;
  tableClassName?: string;
  headClassName?: string;
  bodyClassName?: string;
}

const RequirementsComparisonTable: React.FC<RequirementsComparisonTableProps> = ({
  columns,
  rows,
  className = '',
  tableClassName = '',
  headClassName = '',
  bodyClassName = '',
}) => (
  <div className={`overflow-x-auto rounded-3xl border border-slate-100 shadow-sm ${className}`}>
    <table className={`w-full min-w-[980px] table-fixed border-collapse text-left ${tableClassName}`}>
      <thead className={headClassName}>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.className} scope="col">{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody className={bodyClassName}>
        {rows.map((row) => (
          <tr key={row.key} className={row.className}>
            {row.cells.map((cell, index) => (
              <td key={`${row.key}-${columns[index]?.key ?? index}`} className="align-middle [&>span]:block [&>span]:px-0 [&>span]:py-0">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RequirementsComparisonTable;