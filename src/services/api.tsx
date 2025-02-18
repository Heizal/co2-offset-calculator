import axios from "axios";

//Load api credentials
const API_BASE_URL = import.meta.env.VITE_CLIMATIQ_BASE_URL;
const API_KEY = import.meta.env.VITE_CLIMATIQ_API_KEY;

if (!API_BASE_URL|| !API_KEY){
  throw new Error("Missing API credentials")
}

// Type Definitions
type EnergyUnit = "kWh";

interface EmissionRequest {
  emission_factor: {
    activity_id: string;
    data_version: string;
  };
  parameters: {
    energy: number;
    energy_unit: EnergyUnit;
  };
}

interface EmissionResponse {
  co2e: number;
  co2e_unit: string;
}

// ✅ **Only supports energy emissions now**
export const estimateEmissions = async (
  parameters: EmissionRequest["parameters"]
): Promise<EmissionResponse | null> => {
  const requestBody: EmissionRequest = {
    emission_factor: {
      activity_id: "electricity-supply_grid-source_production_mix", // ✅ Verified activity ID
      data_version: "12.12"
    },
    parameters,
  };

  console.log("🚀 API Request Payload:", requestBody);

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

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error);
    return null; // ✅ Ensure a return value even on error
  }
};