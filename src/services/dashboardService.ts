import api from "@/lib/api";

export const getBusinessPerformance = async () => {
  const response = await api.get("/BusinessPerformance");
  return response.data;
};