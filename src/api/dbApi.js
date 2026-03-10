// src/api/dbApi.js
// Utility functions for interacting with the database-related backend endpoints using axios.

import apiClient from "./apiClient";

export async function testConnection(dbConfig) {
  return apiClient.post("/db/test-connection", dbConfig);
}

export async function getTables(dbConfig) {
  return apiClient.post("/db/tables", dbConfig);
}

export async function getColumns({ table, ...dbConfig }) {
  return apiClient.post("/db/columns", { ...dbConfig, table });
}
