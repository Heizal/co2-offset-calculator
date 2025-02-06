import axios, { AxiosError } from "axios";

// Load API credentials
const API_BASE_URL = import.meta.env.VITE_CLIMATIQ_BASE_URL;
const API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY;

if (!API_BASE_URL || !API_KEY) {
  throw new Error("Missing API credentials. Please check your .env file.");
}

// Define types for API request & response
interface EmissionRequest {
  emission_factor: {
    activity_id: string;
    data_version?: string;
    region?: string;
    source?: string;
  };
  parameters: {
    energy?: number;
    energy_unit?: "kWh";
    weight?: number;
    weight_unit?: "kg";
    distance?: number;
    distance_unit?: "km" | "mi";
    money?: number;
    money_unit?: "usd" | "eur";
  };
}

interface EmissionResponse {
  co2e: number;
  co2e_unit: string;
}

// Function to estimate CO₂ emissions
export const estimateEmissions = async (
  activityId: string,
  parameters: EmissionRequest["parameters"]
): Promise<EmissionResponse> => {
  const requestBody: EmissionRequest = {
    emission_factor: {
      activity_id: activityId,
      data_version: "12.12", // Default version, can be updated
    },
    parameters,
  };

  try {
    const response = await axios.post<EmissionResponse>(
      `${API_BASE_URL}/data/v1/estimate`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "API request failed");
    } else if (error instanceof Error) {
      console.error("General Error:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Unexpected Error:", error);
      throw new Error("An unknown error occurred");
    }
  }
};
