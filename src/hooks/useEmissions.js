import { useState } from "react";
import { estimateEmissions } from "../services/api";
export const useEmission = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emissions, setEmissions] = useState(null);
    const getEmissions = async (energyUsage, startDate, endDate) => {
        setLoading(true);
        setError(null);
        // Calculate the number of days in the selected range
        const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
        const numberOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        const totalEnergy = energyUsage * numberOfDays; // Scale energy usage over the selected period
        console.log(`🔍 Calculating emissions for ${numberOfDays} days: ${totalEnergy} kWh`);
        try {
            const data = await estimateEmissions(totalEnergy);
            if (data) {
                setEmissions(data.co2e);
                return data.co2e; // ✅ Ensure it returns the emissions value
            }
            else {
                setError("Failed to retrieve emissions data.");
                return null;
            }
        }
        catch (err) {
            setError(err.message || "Something went wrong.");
            console.error("API ERROR", err);
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    return { loading, error, emissions, getEmissions };
};
