import { RadioGroup, FormControlLabel, Radio, TextField, Box, MenuItem } from "@mui/material";

function StepOutputConfig({ jobConfig, setJobConfig }) {

  const handleOutputChange = (e) => {
    setJobConfig({
      ...jobConfig,
      output: e.target.value
    });
  };

  const handleStagingDBChange = (field, value) => {
    setJobConfig({
      ...jobConfig,
      stagingDB: {
        ...jobConfig.stagingDB,
        [field]: value
      }
    });
  };

  return (
    <div>
      <h3>Select Output</h3>

      <RadioGroup
        value={jobConfig.output}
        onChange={handleOutputChange}
      >
        <FormControlLabel
          value="csv"
          control={<Radio />}
          label="Export CSV"
        />

        <FormControlLabel
          value="staging"
          control={<Radio />}
          label="Insert to Staging DB"
        />
      </RadioGroup>

      {jobConfig.output === "staging" && (
        <Box sx={{ mt: 2 }}>
          <h4>Staging Database Credentials</h4>
          <TextField
            select
            label="DB Type"
            value={jobConfig.stagingDB.type || "mysql"}
            onChange={(e) => handleStagingDBChange("type", e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="mysql">MySQL</MenuItem>
            <MenuItem value="postgres">Postgres</MenuItem>
          </TextField>
          <TextField
            label="Host"
            value={jobConfig.stagingDB.host || ""}
            onChange={(e) => handleStagingDBChange("host", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Port"
            value={jobConfig.stagingDB.port || ""}
            onChange={(e) => handleStagingDBChange("port", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="User"
            value={jobConfig.stagingDB.user || ""}
            onChange={(e) => handleStagingDBChange("user", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={jobConfig.stagingDB.password || ""}
            onChange={(e) => handleStagingDBChange("password", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database"
            value={jobConfig.stagingDB.database || ""}
            onChange={(e) => handleStagingDBChange("database", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Table Name"
            value={jobConfig.stagingDB.table || ""}
            onChange={(e) => handleStagingDBChange("table", e.target.value)}
            fullWidth
            margin="normal"
            helperText="Leave empty to use source table name"
          />
        </Box>
      )}
    </div>
  );
}

export default StepOutputConfig;