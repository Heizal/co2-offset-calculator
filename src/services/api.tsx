import axios, { AxiosError } from "axios";

// Load API credentials from environment variables
const API_BASE_URL = import.meta.env.VITE_CLIMATIQ_BASE_URL;
const API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY;

// Ensure API keys are properly set
if (!API_BASE_URL || !API_KEY) {
  throw new Error("Missing API credentials. Please check your .env file.");
}

// Type Definitions
type EnergyUnit = "kWh";
type WeightUnit = "kg";
type DistanceUnit = "km" | "mi";
type MoneyUnit = "usd" | "eur";

interface EmissionRequest {
  emission_factor: {
    activity_id: string;
    data_version?: string;
    region?: string;
    source?: string;
  };
  parameters: {
    energy?: number;
    energy_unit?: EnergyUnit;
    weight?: number;
    weight_unit?: WeightUnit;
    distance?: number;
    distance_unit?: DistanceUnit;
    money?: number;
    money_unit?: MoneyUnit;
  };
}

interface EmissionResponse {
  co2e: number;
  co2e_unit: string;
}

interface ApiError {
  message: string;
  status?: number;
}

// ✅ **Fix: Return `null` in case of an error**
export const estimateEmissions = async (
  activityId: string,
  parameters: EmissionRequest["parameters"]
): Promise<EmissionResponse | null> => {
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
    let errorMessage = "An unexpected error occurred.";
    let statusCode: number | undefined;

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status;
      errorMessage =
        error.response?.data?.message || `Request failed with status ${statusCode}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("API Error:", errorMessage);
    return null; // ✅ Ensure a return value even on error
  }
};
