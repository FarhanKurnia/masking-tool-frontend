import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, LinearProgress, Alert } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (runId) {
      const interval = setInterval(async () => {
        try {
          const resp = await getRunStatus(runId);
          setStatus(resp.data);
          if (resp.data.status === "completed" || resp.data.status === "failed") {
            clearInterval(interval);
          }
          setStatus(resp.data);
          // keep modal visible until user closes/minimizes
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
      if (jobConfig.output === "target" || jobConfig.output === "staging") {
        // support legacy staging value too
        createPayload.targetDB = { ...jobConfig.targetDB, port: parseInt(jobConfig.targetDB.port) };
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

      // 3. run job – supply connection details again (not persisted by server)
      const runPayload = {
        sourceDB: { ...jobConfig.sourceDB, port: parseInt(jobConfig.sourceDB.port) },
      };
      if (jobConfig.output === "target") {
        runPayload.targetDB = { ...jobConfig.targetDB, port: parseInt(jobConfig.targetDB.port) };
      }
      const runResp = await runJob(jobId, runPayload);
      const newRunId = runResp.data.run_id;
      setRunId(newRunId);
      setStatus({ status: "running" });
      setShowModal(true);
      setShowModal(true);
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

  // modal close handler (minimize)
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // create a sanitized copy for display: drop stagingDB and hide passwords
  const displayConfig = React.useMemo(() => {
    const copy = JSON.parse(JSON.stringify(jobConfig || {}));
    delete copy.stagingDB; // no longer relevant
    if (copy.sourceDB) {
      copy.sourceDB.password = copy.sourceDB.password ? "••••••" : "";
    }
    if (copy.targetDB) {
      copy.targetDB.password = copy.targetDB.password ? "••••••" : "";
    }
    return copy;
  }, [jobConfig]);

  return (
    <div>
      <h3>Ready to Run</h3>
      <pre>{JSON.stringify(displayConfig, null, 2)}</pre>
      <Button variant="contained" onClick={runJobHandler} disabled={runId && status?.status === "running"}>
        {runId ? "Job Started" : "Run Masking Job"}
      </Button>
      {status && !showModal && (
        <div style={{ padding: 16 }}>
          {status.status === "running" && <LinearProgress />}
          <p>Status: <strong>{status.status.toUpperCase()}</strong></p>
          {status.rows_processed !== undefined && <p>Rows Processed: {status.rows_processed}</p>}
          {status.log && <p>Log: {status.log}</p>}
          {status.status === "completed" && (
            <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mt: 1 }}>
              Completed!{jobConfig.output === "csv" && (
                <Button size="small" onClick={downloadCSV} sx={{ ml: 2 }}>
                  Download CSV
                </Button>
              )}
              {jobConfig.output === "target" && <span> Data inserted into target database.</span>}
            </Alert>
          )}
          {status.status === "failed" && (
            <Alert icon={<ErrorOutlineIcon />} severity="error" sx={{ mt: 1 }}>
              Job failed: {status.log}
            </Alert>
          )}
        </div>
      )}

      {/* Reopen modal button when minimized */}
      {!showModal && runId && (
        <Button size="small" onClick={() => setShowModal(true)}>
          Show run details
        </Button>
      )}

      {/* Status modal */}
      <Dialog open={showModal} onClose={handleCloseModal} fullWidth>
        <DialogTitle>
          Job Status
          <IconButton
            aria-label="minimize"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            &minus;
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {status?.status === "running" && <LinearProgress sx={{ mb: 2 }} />}
          <p>Status: <strong>{status?.status}</strong></p>
          {status?.rows_processed !== undefined && <p>Rows Processed: {status.rows_processed}</p>}
          {status?.log && <p>Log: {status.log}</p>}
          {status?.status === "completed" && (
            <Alert icon={<CheckCircleOutlineIcon />} severity="success" sx={{ mt: 1 }}>
              Completed successfully
            </Alert>
          )}
          {status?.status === "failed" && (
            <Alert icon={<ErrorOutlineIcon />} severity="error" sx={{ mt: 1 }}>
              Failure: {status?.log}
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StepRunJob;
