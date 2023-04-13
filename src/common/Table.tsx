import { ReactNode } from "react";

export const Table: React.FC<{
  data?: any;
  columns: (object | string)[];
  empty?: ReactNode | string;
  render?: (options: any) => React.ReactNode;
}> = ({ data, empty, columns, render }) => {
  if (!data || data.length === 0) {
    return <div>{empty || "Empty!"}</div>;
  }

  return (
    <table className="table table-sm table-striped table-hover">
      <thead>
        <tr>
          {columns.map((column: any, idx) =>
            typeof column === "object" ? (
              <td
                key={column?.key || idx}
                {...{
                  ...(column?.headerClassName
                    ? { className: column.headerClassName }
                    : {}),
                  ...(column?.headerStyle ? { style: column.headerStyle } : {}),
                }}
              >
                {column.headerControl || column.title}
              </td>
            ) : (
              <td key={idx}>{column}</td>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {data.map?.((row: any, idx: number) => {
          const cells = row.cells || row;
          return (
            <tr
              key={row.key || row.id || idx}
              className={row.variant ? `table-${row.variant}` : ""}
            >
              {Array.isArray(cells)
                ? cells.map((cell, cdx) => (
                    <td
                      key={cdx}
                      {...{
                        ...(cell?.control && cell?.className
                          ? { className: cell.className }
                          : {}),
                        ...(cell?.control && cell?.style
                          ? { style: cell.style }
                          : {}),
                      }}
                    >
                      {cell?.control ? cell.control : cell}
                    </td>
                  ))
                : columns.map((column: any, cdx) =>
                    typeof column === "object" ? (
                      <td
                        key={cdx}
                        {...{
                          ...(column?.itemClassName
                            ? { className: column.itemClassName }
                            : {}),
                          ...(column?.style ? { style: column.style } : {}),
                        }}
                      >
                        {column.render
                          ? render?.({ key: column.render, item: cells })
                          : cells[column.key]}
                      </td>
                    ) : (
                      <td key={idx}>{cells[column]}</td>
                    )
                  )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
