import { useState } from "react";
import { estimateEmissions } from "../services/api";

interface UseEmissionResult {
  loading: boolean;
  error: string | null;
  emissions: number | null;
  getEmissions: (dailyUsageKWh: number, period: "daily" | "monthly" | "annually") => Promise<void>;
}

export const useEmission = (): UseEmissionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emissions, setEmissions] = useState<number | null>(null);

  const getEmissions = async (dailyUsageKwh: number, period: "daily" | "monthly" | "annually") => {
    setLoading(true);
    setError(null);

    const periodMultiplier: Record<"daily" | "monthly" | "annually", number> = {
      daily: 1,
      monthly: 30,
      annually: 365,
    };

    const totalEnergy = dailyUsageKwh * (periodMultiplier[period]);

    console.log(`🔍 Calculating emissions for ${period}: ${totalEnergy} kWh`);


    try {
      const data = await estimateEmissions(totalEnergy);

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