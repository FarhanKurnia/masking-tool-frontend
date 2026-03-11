import { RadioGroup, FormControlLabel, Radio, TextField, Box, MenuItem } from "@mui/material";

function StepOutputConfig({ jobConfig, setJobConfig }) {

  const handleOutputChange = (e) => {
    setJobConfig({
      ...jobConfig,
      output: e.target.value
    });
  };

  const handleTargetDBChange = (field, value) => {
    setJobConfig({
      ...jobConfig,
      targetDB: {
        ...jobConfig.targetDB,
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
          value="target"
          control={<Radio />}
          label="Insert to Target DB"
        />
      </RadioGroup>

      {jobConfig.output === "target" && (
        <Box sx={{ mt: 2 }}>
          <h4>Target Database Credentials</h4>
          <TextField
            select
            label="DB Type"
            value={jobConfig.targetDB.type || "mysql"}
            onChange={(e) => handleTargetDBChange("type", e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="mysql">MySQL</MenuItem>
            <MenuItem value="postgres">Postgres</MenuItem>
          </TextField>
          <TextField
            label="Host"
            value={jobConfig.targetDB.host || ""}
            onChange={(e) => handleTargetDBChange("host", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Port"
            value={jobConfig.targetDB.port || ""}
            onChange={(e) => handleTargetDBChange("port", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="User"
            value={jobConfig.targetDB.user || ""}
            onChange={(e) => handleTargetDBChange("user", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={jobConfig.targetDB.password || ""}
            onChange={(e) => handleTargetDBChange("password", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database"
            value={jobConfig.targetDB.database || ""}
            onChange={(e) => handleTargetDBChange("database", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Table Name"
            value={jobConfig.targetDB.table || ""}
            onChange={(e) => handleTargetDBChange("table", e.target.value)}
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