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

//Dynamically fetch lastest emission factor of electricity
export const fetchEmissionFactor = async () =>{
  try{
    const response = await axios.get(`${API_BASE_URL}/data/v1/search`, {
      headers:{
        Authorization: `Bearer ${API_KEY}`
      },
      params:{
        query: "electricity consumption",
        data_version: "12.12"
      }
    });

    if (response.data.results.length > 0){
      console.log("Emission Factor Fetched", response.data.results[0]);
      return response.data.results[0]; //returns first matching emission factor
    } else{
      throw new Error("No emission factor")
    }
  } catch(error){
    console.error("Error fetching emission factor:", error)
    return null;
  }
}

//Function to estimate emissions based on energy usage
export const estimateEmissions = async (energy: number) =>{
  const emissionFactor = await fetchEmissionFactor();

  if (!emissionFactor){
    console.log("Failed to retrive emission factor");
    return null
  }

  const requestBody = {
    emission_factor:{
      activity_id: "electricity-supply_grid-source_production_mix",
      data_version: "12.12"
    },
    parameters:{
      energy,
      energy_unit: "kWh"
    },
  };
  
  console.log("Api Request Payload", requestBody)

  try{
    const response = await axios.post(`${API_BASE_URL}/data/v1/estimate`, requestBody, {
      headers:{
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API response:", response.data)
    return response.data
  } catch (error){
    console.error("API Error", error);
    return null;
  }
}