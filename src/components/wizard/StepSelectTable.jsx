import { useEffect, useState } from "react";
import { getTables } from "../../api/dbApi";

function StepSelectTable({ jobConfig, setJobConfig }) {

  const [tables, setTables] = useState([]);

  useEffect(() => {

    loadTables();

  }, []);

  const loadTables = async () => {

    const res = await getTables({
      ...jobConfig.sourceDB,
      port: parseInt(jobConfig.sourceDB.port),
    });

    // axios wraps JSON in res.data; backend nests tables under data
    setTables(res.data.data.tables);

  };

  return (

    <div>

      <h3>Select Table</h3>

      {tables.map((table) => (

        <div key={table}>

          <input
            type="radio"
            name="table"
            value={table}
            checked={jobConfig.table === table}
            onChange={() =>
              setJobConfig({
                ...jobConfig,
                table
              })
            }
          />

          {table}

        </div>

      ))}

    </div>

  );

}

export default StepSelectTable;