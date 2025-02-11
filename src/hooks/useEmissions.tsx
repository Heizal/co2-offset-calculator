import { useState } from "react";
import { estimateEmissions } from "../services/api";

interface UseEmissionResult {
  loading: boolean;
  error: string | null;
  emissions: number | null;
  getEmissions: (activityId: string, parameters: any) => Promise<void>;
}

export const useEmission = (): UseEmissionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissions, setEmissions] = useState<number | null>(null);

  const getEmissions = async (activityId: string, parameters: any) => {
    setLoading(true);
    setError(null);

    try {
      const data = await estimateEmissions(activityId, parameters);
      if (data) {
        setEmissions(data.co2e);
      } else {
        setError("Failed to retrieve emissions data.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, emissions, getEmissions };
};
