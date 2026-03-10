// src/api/jobApi.js
// API wrappers for job-related backend endpoints using axios.

import apiClient from "./apiClient";

export async function getJobs() {
  // returns axios response; caller can access .data where the array lives
  return apiClient.get("/jobs");
}

export async function getJobDetail(id) {
  return apiClient.get(`/jobs/${id}`);
}

export async function getJobLogs(id) {
  return apiClient.get(`/jobs/${id}/logs`);
}

export async function createJob(payload) {
  // payload should include name, sourceDB, table, output
  return apiClient.post("/jobs", payload);
}

export async function saveMaskingRules(jobId, rulesPayload) {
  // rulesPayload: { rules: [ {column, type, parameters} ] }
  return apiClient.post(`/jobs/${jobId}/masking-rules`, rulesPayload);
}

export async function runJob(jobId) {
  return apiClient.post(`/jobs/${jobId}/run`);
}

export async function getRunStatus(runId) {
  return apiClient.get(`/runs/${runId}`);
}
