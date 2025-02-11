import { describe, test, expect } from "vitest";
import { estimateEmissions } from "../services/api";

describe("Climatiq API Tests", () => {
  test("should return CO₂ emissions estimate for electricity use", async () => {
    const activityId = "electricity-supply_grid-source_production_mix";
    const parameters = {
      energy: 100,
      energy_unit: "kWh" as "kWh",
    };

    const emissions = await estimateEmissions(activityId, parameters);

    expect(emissions).not.toBeNull();

    expect(emissions!.co2e).toBeDefined();
    expect(emissions!.co2e_unit).toBeDefined();
    expect(typeof emissions!.co2e).toBe("number");
    expect(emissions!.co2e_unit).toBe("kg"); // Assuming the API returns kgCO2e
  });
});

