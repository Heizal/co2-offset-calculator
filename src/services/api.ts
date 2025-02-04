import axios from "axios";

const api = axios.create({
  baseURL: "https://api.co2offset.io",
  headers: { "Content-Type": "application/json" },
});

export const getCO2Data = async (data: any) => {
  try {
    const response = await api.post("/calculate", data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

api.interceptors.request.use(
    (config) => {
      console.log("Request sent:", config);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data);
      return Promise.reject(error);
    }
  );
  
