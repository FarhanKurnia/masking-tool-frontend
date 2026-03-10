import { useEffect, useState } from "react";

import { getColumns } from "../../api/dbApi";
import { getMaskingTypes } from "../../api/maskingApi";

import ColumnMaskingTable from "../ColumnMaskingTable";

function StepMaskingConfig({ jobConfig, setJobConfig }) {

  const [columns, setColumns] = useState([]);

  const [maskingTypes, setMaskingTypes] = useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    const colRes = await getColumns({
      ...jobConfig.sourceDB,
      port: parseInt(jobConfig.sourceDB.port),
      table: jobConfig.table
    });

    const maskRes = await getMaskingTypes();

    // attach maskType placeholder to each column, preserving existing configurations
    const colsWithMask = colRes.data.data.columns.map((c) => {
      // Check if we already have masking config for this column
      const existingConfig = jobConfig.columns?.find(col => col.column_name === c);
      return {
        column_name: c,
        maskType: existingConfig ? existingConfig.maskType : "",
      };
    });

    setColumns(colsWithMask);
    setMaskingTypes(maskRes.data.data);

  };

  return (

    <div>

      <h3>Configure Masking</h3>

      <ColumnMaskingTable
        columns={columns}
        maskingTypes={maskingTypes}
        onChange={(column, maskType) => {
          const updated = columns.map((c) =>
            c.column_name === column ? { ...c, maskType } : c
          );
          setColumns(updated);
          setJobConfig({
            ...jobConfig,
            columns: updated,
          });
        }}
      />

    </div>

  );

}

export default StepMaskingConfig;