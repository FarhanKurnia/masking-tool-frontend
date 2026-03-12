import { useEffect, useState } from "react";
import { getJobs } from "../api/jobAPI";
import DashboardLayout from "../layout/DashboardLayout";

import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [jobs, setJobs] = useState([]);
  const [elapsed, setElapsed] = useState({});
  const navigate = useNavigate();

  // Helper function to format elapsed time
  const formatElapsedTime = (startedAt, finishedAt) => {
    if (!startedAt) return "-";
    
    const start = new Date(startedAt).getTime();
    const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
    const seconds = Math.floor((end - start) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (minutes < 60) return `${minutes}m ${secs}s`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const fetchJobs = () => {
      getJobs()
        .then(res => {
          if (res.data && res.data.data) {
            setJobs(res.data.data);
          } else {
            setJobs([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch jobs:", err);
          setJobs([]);
        });
    };

    fetchJobs(); // Initial fetch

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchJobs, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update elapsed time every second for running jobs
  useEffect(() => {
    const interval = setInterval(() => {
      const newElapsed = {};
      jobs.forEach(job => {
        if (job.status === "running" || job.status === "pending") {
          newElapsed[job.id] = formatElapsedTime(job.started_at, job.finished_at);
        } else {
          newElapsed[job.id] = formatElapsedTime(job.started_at, job.finished_at);
        }
      });
      setElapsed(newElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [jobs]);

  return (
    <DashboardLayout>

      <Typography variant="h4" gutterBottom>
        Masking Jobs
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/new-job")}
        sx={{ mb: 2 }}
      >
        New Masking Job
      </Button>

      <Paper>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Table</TableCell>
              <TableCell>Output</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Rows</TableCell>
              <TableCell>Elapsed Time</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.map(job => (
              <TableRow 
                key={job.id} 
                sx={{ 
                  backgroundColor: job.status === 'RUNNING' ? '#fff3cd' : 'inherit',
                  '&:hover': {
                    backgroundColor: job.status === 'RUNNING' ? '#ffeaa7' : '#f5f5f5',
                  }
                }}
              >
                <TableCell>{job.table_name}</TableCell>
                <TableCell>
                  {job.output_type === "target" ? "table" : job.output_type}
                </TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.total_rows}</TableCell>
                <TableCell>{elapsed[job.id] || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>

    </DashboardLayout>
  );
}