// src/api/maskingApi.js
// API wrappers for masking-specific backend endpoints using axios.

import apiClient from "./apiClient";

export async function getMaskingTypes() {
  return apiClient.get("/masking/types");
}

export async function runMasking(jobConfig) {
  return apiClient.post("/masking/run", jobConfig);
}
