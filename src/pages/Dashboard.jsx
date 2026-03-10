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
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

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
              <TableCell>ID</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Rows</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {jobs.map(job => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.table_name}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.total_rows}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>

    </DashboardLayout>
  );
}