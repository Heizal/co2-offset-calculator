import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import EmissionCalculator from "../components/EmissionCalculator";
import { estimateEmissions } from "../services/api";
import { MemoryRouter } from "react-router-dom";

// Mock API function
vi.mock("../services/api", () => ({
  estimateEmissions: vi.fn(),
}));

describe("EmissionCalculator Component", () => {
  test("should fetch emissions on button click", async () => {
    (estimateEmissions as jest.Mock).mockResolvedValue({ co2e: 200, co2e_unit: "kg" });

    render(
        <MemoryRouter>
            <EmissionCalculator />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Energy Usage/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /calculate emissions/i }));

    await waitFor(() => expect(screen.getByText(/Estimated Emissions:/i)).toBeInTheDocument());

    expect(screen.getByText(/200 kg CO₂e/i)).toBeInTheDocument();
  });

  test("should show loading state", async () => {
    let resolveFn: (value: { co2e: number; co2e_unit: string }) => void = () => {};
  
    (estimateEmissions as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFn = resolve; // ✅ Now correctly initialized before use
        })
    );
  
    render(
        <MemoryRouter>
            <EmissionCalculator />
        </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole("button", { name: /calculate emissions/i }));
  
    // ✅ Ensure the loading state is displayed
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Calculating..."));
  
    // Now resolve the promise
    resolveFn({ co2e: 100, co2e_unit: "kg" });
  
    await waitFor(() => expect(screen.getByText(/100 kg CO₂e/i)).toBeInTheDocument());
  });
});
