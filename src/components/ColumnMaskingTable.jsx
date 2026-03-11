import React from "react";

export default function ColumnMaskingTable({ columns, maskingTypes, onChange }) {
  if (!columns || columns.length === 0) {
    return <p>No columns found</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Column</th>
          <th style={{ border: "1px solid #ccc", padding: "8px" }}>Masking Type</th>
        </tr>
      </thead>
      <tbody>
        {columns.map((col) => (
          <tr key={col.column_name}>
            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              {col.column_name}
            </td>

            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
              <select
                value={col.maskType || ""}
                onChange={(e) =>
                  onChange(col.column_name, e.target.value)
                }
              >
                <option value="">No mask</option>

                {maskingTypes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}