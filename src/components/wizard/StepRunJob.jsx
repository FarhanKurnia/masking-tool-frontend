import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import {
  createJob,
  saveMaskingRules,
  runJob,
  getRunStatus,
} from "../../api/jobAPI";
import apiClient from "../../api/apiClient";

function StepRunJob({ jobConfig }) {
  const [runId, setRunId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (runId) {
      const interval = setInterval(async () => {
        try {
          const resp = await getRunStatus(runId);
          setStatus(resp.data);
          if (resp.data.status === "completed" || resp.data.status === "failed") {
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Failed to get run status:", err);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [runId]);

  const runJobHandler = async () => {
    try {
      // 1. create job
      const createPayload = {
        name: jobConfig.name || "Masking Job",
        sourceDB: { ...jobConfig.sourceDB, port: parseInt(jobConfig.sourceDB.port) },
        table: jobConfig.table,
        output: jobConfig.output,
      };
      if (jobConfig.output === "staging") {
        createPayload.stagingDB = { ...jobConfig.stagingDB, port: parseInt(jobConfig.stagingDB.port) };
      }
      const createResp = await createJob(createPayload);
      const jobId = createResp.data.id;

      // 2. prepare rules from columns
      const rules = (jobConfig.columns || [])
        .filter((c) => c.maskType)
        .map((c) => ({
          column: c.column_name,
          type: c.maskType,
          parameters: {},
        }));

      if (rules.length > 0) {
        await saveMaskingRules(jobId, { rules });
      }

      // 3. run job
      const runResp = await runJob(jobId);
      const newRunId = runResp.data.run_id;
      setRunId(newRunId);
      setStatus({ status: "running" });
    } catch (err) {
      console.error(err);
      alert("Failed to start job: " + err.message);
    }
  };

  const downloadCSV = () => {
    if (runId) {
      window.open(`${apiClient.defaults.baseURL}/runs/${runId}/download`, "_blank");
    }
  };

  return (
    <div>
      <h3>Ready to Run</h3>
      <pre>{JSON.stringify(jobConfig, null, 2)}</pre>
      <Button variant="contained" onClick={runJobHandler} disabled={runId && status?.status === "running"}>
        {runId ? "Job Started" : "Run Masking Job"}
      </Button>
      {status && (
        <div>
          <p>Status: {status.status}</p>
          {status.rows_processed !== undefined && <p>Rows Processed: {status.rows_processed}</p>}
          {status.log && <p>Log: {status.log}</p>}
          {status.status === "completed" && jobConfig.output === "csv" && (
            <Button variant="outlined" onClick={downloadCSV}>
              Download CSV
            </Button>
          )}
          {status.status === "completed" && jobConfig.output === "staging" && (
            <p>Data has been successfully inserted into the staging database.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StepRunJob;
