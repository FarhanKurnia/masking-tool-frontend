import { TextField, Button, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

import { testConnection } from "../../api/dbApi";

function StepConnectDB({ jobConfig, setJobConfig }) {

  const [db, setDb] = useState({
    type: jobConfig.sourceDB?.type || "mysql",
    host: jobConfig.sourceDB?.host || "",
    port: jobConfig.sourceDB?.port || 3306,
    user: jobConfig.sourceDB?.user || "",
    password: jobConfig.sourceDB?.password || "",
    database: jobConfig.sourceDB?.database || ""
  });

  useEffect(() => {
    setJobConfig({
      ...jobConfig,
      sourceDB: db
    });
  }, [db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = {
      ...db,
      [name]: value
    };

    // if user changes type, adjust default port
    if (name === "type") {
      updated.port = value === "mysql" ? 3306 : 5432;
    }

    setDb(updated);
  };

  const testDB = async () => {

    try {

      await testConnection(db);

      alert("Connection successful");

      setJobConfig({
        ...jobConfig,
        sourceDB: db
      });

    } catch {

      alert("Connection failed");

    }

  };

  return (

    <div style={{ display: "grid", gap: 15, maxWidth: 400 }}>

      <TextField
        select
        label="DB Type"
        name="type"
        value={db.type}
        onChange={handleChange}
        sx={{ width: 150 }}
      >
        <MenuItem value="mysql">MySQL</MenuItem>
        <MenuItem value="postgres">Postgres</MenuItem>
      </TextField>

      <TextField
        label="Host"
        name="host"
        value={db.host}
        onChange={handleChange}
      />

      <TextField
        label="Port"
        name="port"
        value={db.port}
        onChange={(e) =>
          handleChange({
            target: {
              name: "port",
              value: parseInt(e.target.value) || 0
            }
          })
        }
      />

      <TextField
        label="Username"
        name="user"
        value={db.user}
        onChange={handleChange}
      />

      <TextField
        label="Password"
        type="password"
        name="password"
        value={db.password}
        onChange={handleChange}
      />

      <TextField
        label="Database"
        name="database"
        value={db.database}
        onChange={handleChange}
      />

      <Button
        variant="outlined"
        onClick={testDB}
      >
        Test Connection
      </Button>

    </div>

  );

}

export default StepConnectDB;