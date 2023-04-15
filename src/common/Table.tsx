import React, { ReactNode } from "react";
import { Button } from "./Button";
import { ButtonWithConfirmation } from "./ButtonWithConfirmation";
import { getValue } from "./helpers";

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
                : columns.map((column: any, cdx) => {
                    if (column.render === "edit-button") {
                      column.render = "button";
                      column.label = column.label || "Edit";
                      column.variant = column.variant || "warning";
                      column.style = {
                        width: "100px",
                        ...(column.style || {}),
                      };
                    } else if (column.render === "delete-button") {
                      column.render = "confirm-button";
                      column.label = column.label || "Delete";
                      column.variant = column.variant || "danger";
                      column.style = {
                        width: "100px",
                        ...(column.style || {}),
                      };
                      column.onAction = column.onAction || column.onClick;
                    }
                    return typeof column === "object" ? (
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
                          ? typeof column.render === "function"
                            ? column.render(cells)
                            : render?.({ key: column.render, item: cells }) ||
                              (column.render === "button" ? (
                                <Button
                                  variant={column.variant}
                                  label={column.label}
                                  data={cells}
                                  onClick={column.onClick}
                                />
                              ) : column.render === "confirm-button" ? (
                                <ButtonWithConfirmation
                                  label={column.label}
                                  title={column.title || "Confirm?"}
                                  message={
                                    column.message ||
                                    "Are you sure to continue?"
                                  }
                                  data={cells}
                                  variant={column.variant}
                                  onAction={column.onAction}
                                />
                              ) : (
                                <></>
                              ))
                          : getValue(cells, column.key)}
                      </td>
                    ) : (
                      <td key={idx}>{cells[column]}</td>
                    );
                  })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
