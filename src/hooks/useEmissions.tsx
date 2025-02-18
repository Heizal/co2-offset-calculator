import { useState } from "react";
import { estimateEmissions } from "../services/api";

interface UseEmissionResult {
  loading: boolean;
  error: string | null;
  emissions: number | null;
  getEmissions: (energy: any) => Promise<void>;
}

export const useEmission = (): UseEmissionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissions, setEmissions] = useState<number | null>(null);

  const getEmissions = async (energy: number) => {
    setLoading(true);
    setError(null);

    try {
      const data = await estimateEmissions({
        energy,
        energy_unit: "kWh",
      });
      if (data) {
        setEmissions(data.co2e);
      } else {
        setError("Failed to retrieve emissions data.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      console.error("API ERROR", err)
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, emissions, getEmissions };
};