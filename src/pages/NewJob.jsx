import { useState, useEffect } from "react";

import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";

import DashboardLayout from "../layout/DashboardLayout";

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
  };

  const nextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setActiveStep((prev) => prev - 1);
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
          >
            Next
          </Button>
        )}

      </Box>

    </DashboardLayout>

  );

}

export default NewJob;