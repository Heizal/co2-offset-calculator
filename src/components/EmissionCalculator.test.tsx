import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import EmissionCalculator from "../components/EmissionCalculator";
import { useEmission } from "../hooks/useEmissions";
import { MemoryRouter } from "react-router-dom";
import { fetchEmissionFactor } from "../services/api";

// ✅ Mock `useEmission` Hook
vi.mock("../hooks/useEmissions", () => ({
  useEmission: vi.fn(),
}));

// ✅ Mock `fetchEmissionFactor`
vi.mock("../services/api", () => ({
  fetchEmissionFactor: vi.fn(),
}));

// ✅ Mock `saveEmissionData`
const mockSaveEmissionData = vi.fn();
vi.mock("../services/emissionsService", () => ({
  saveEmissionData: (...args:any[]) => mockSaveEmissionData(...args),
}));

// 📌 Setup Mock Data
const mockEmissionFactor = {
  category: "Electricity",
  region_name: "Germany",
  description: "Electricity consumption emission factor",
};

beforeEach(() => {
  vi.clearAllMocks(); // ✅ Ensure no leftover state between tests
  (fetchEmissionFactor as jest.Mock).mockResolvedValue(mockEmissionFactor);
});

describe("EmissionCalculator Component", () => {
  test("should enable button when valid inputs are provided", async () => {

    (useEmission as jest.Mock).mockReturnValue({
      loading: false,
      emissions: null,
      error: null,
      getEmissions: vi.fn().mockResolvedValue(150), // Mock emissions response
    });

    render(
      <MemoryRouter>
        <EmissionCalculator />
      </MemoryRouter>
    );

    // Simulate energy input
    fireEvent.change(screen.getByLabelText(/Energy Usage \(kWh\)/i), { target: { value: "100" } });

    // Simulate date selection
    fireEvent.change(screen.getByPlaceholderText("Start Date"), { target: { value: "2025-02-01" } });
    fireEvent.change(screen.getByPlaceholderText("End Date"), { target: { value: "2025-02-28" } });

    // Ensure button is enabled
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /calculate emissions/i })).not.toBeDisabled();
    });
  });

  test("should show error for invalid energy input", async () => {
    (useEmission as jest.Mock).mockReturnValue({
      loading: false,
      emissions: null,
      error: null,
      getEmissions: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EmissionCalculator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Energy Usage \(kWh\)/i), { target: { value: "-50" } });
    fireEvent.click(screen.getByRole("button", { name: /calculate emissions/i }));

    expect(await screen.findByText(/please enter a valid positive number/i)).toBeInTheDocument();
  });

  test("should show error when date range is missing", async () => {
    (useEmission as jest.Mock).mockReturnValue({
      loading: false,
      emissions: null,
      error: null,
      getEmissions: vi.fn(),
    });

    render(
      <MemoryRouter>
        <EmissionCalculator />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Energy Usage \(kWh\)/i), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /calculate emissions/i }));

    expect(await screen.findByText(/please select a date range/i)).toBeInTheDocument();
  });
});
