import { useState, useEffect } from "react";

import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";

import DashboardLayout from "../layout/DashboardLayout";
import { testConnection } from "../api/dbApi";

import StepConnectDB from "../components/wizard/StepConnectDB";
import StepSelectTable from "../components/wizard/StepSelectTable";
import StepMaskingConfig from "../components/wizard/StepMaskingConfig";
import StepOutputConfig from "../components/wizard/StepOutputConfig";
import StepRunJob from "../components/wizard/StepRunJob";

const steps = [
  "Connect Production DB",
  "Select Table",
  "Configure Masking",
  "Output Configuration",
  "Run Job"
];

function NewJob() {

  const [activeStep, setActiveStep] = useState(0);

  // state for connection failure modal
  const [connectionError, setConnectionError] = useState("");
  const [showConnectionError, setShowConnectionError] = useState(false);

  const [jobConfig, setJobConfig] = useState(() => {
    const saved = localStorage.getItem("jobConfig");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        // migrate stagingDB -> targetDB if present
        if (obj.stagingDB && !obj.targetDB) {
          obj.targetDB = obj.stagingDB;
        }
        // normalize output field
        if (obj.output === "staging") {
          obj.output = "target";
        }
        return obj;
      } catch (e) {
        console.error("Failed to parse saved job config:", e);
      }
    }
    return {
      sourceDB: {},
      table: "",
      columns: [],
      output: "csv",
      targetDB: {}
    };
  });

  useEffect(() => {
    localStorage.setItem("jobConfig", JSON.stringify(jobConfig));
  }, [jobConfig]);

  const handleResetConfig = () => {
    setJobConfig({
      sourceDB: {},
      table: "",
      columns: [],
      output: "csv",
      targetDB: {}
    });
    localStorage.removeItem("jobConfig");
    setActiveStep(0);
  };

  const nextStep = async () => {
    // if we're on the first step, verify the database connection before proceeding
    if (activeStep === 0) {
      try {
        const db = jobConfig.sourceDB || {};
        await testConnection({
          ...db,
          port: parseInt(db.port)
        });
      } catch (err) {
        console.error("connection test failed", err);
        setConnectionError(err.response?.data?.error || err.message || "Failed to connect");
        setShowConnectionError(true);
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  // determine whether the "Next" button should be disabled based on current step inputs
  const shouldDisableNext = () => {
    switch (activeStep) {
      case 0: {
        const db = jobConfig.sourceDB || {};
        // require basic connection details before moving on
        return !(
          db.host &&
          db.user &&
          db.database
        );
      }
      case 1:
        return !jobConfig.table;
      case 2:
        // masking step has no mandatory fields; allow progression
        return false;
      case 3: {
        if (jobConfig.output === "target") {
          const t = jobConfig.targetDB || {};
          return !(t.host && t.user && t.database);
        }
        return false;
      }
      default:
        return true;
    }
  };

  const renderStep = () => {

    switch (activeStep) {

      case 0:
        return (
          <StepConnectDB
            jobConfig={jobConfig}
            setJobConfig={setJobConfig}
          />
        );

      case 1:
        return (
          <StepSelectTable
            jobConfig={jobConfig}
            setJobConfig={setJobConfig}
          />
        );

      case 2:
        return (
          <StepMaskingConfig
            jobConfig={jobConfig}
            setJobConfig={setJobConfig}
          />
        );

      case 3:
        return (
          <StepOutputConfig
            jobConfig={jobConfig}
            setJobConfig={setJobConfig}
          />
        );

      case 4:
        return (
          <StepRunJob
            jobConfig={jobConfig}
          />
        );

      default:
        return <Typography>Done</Typography>;

    }

  };

  return (

    <DashboardLayout>

      <Typography variant="h4" gutterBottom>
        Create Masking Job
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>

        {steps.map((label, index) => (

          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>

        ))}

      </Stepper>

      <Paper sx={{ p: 3 }}>

        <Box>

          {renderStep()}

        </Box>

      </Paper>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3
        }}
      >

        <Button
          disabled={activeStep === 0}
          onClick={prevStep}
          variant="contained"
        >
          Back
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleResetConfig}
        >
          Reset Config
        </Button>

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={nextStep}
            disabled={shouldDisableNext()}
          >
            Next
          </Button>
        )}

      </Box>

      {/* connection failure modal */}
      <Dialog
        open={showConnectionError}
        onClose={() => setShowConnectionError(false)}
      >
        <DialogTitle>Connection Error</DialogTitle>
        <DialogContent>
          <Typography>{connectionError}</Typography>
        </DialogContent>
      </Dialog>

    </DashboardLayout>

  );

}

export default NewJob;