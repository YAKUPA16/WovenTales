// [Frontend] client/src/services/dashboardService.js
import axiosInstance from "./axiosInstance";

export async function fetchDashboard() {
  const res = await axiosInstance.get("/dashboard");
  return res.data;
}
