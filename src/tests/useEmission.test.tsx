import { describe, test, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEmission } from "../hooks/useEmissions";
import { estimateEmissions } from "../services/api";

// Mock the API function
vi.mock("../services/api", () => ({
  estimateEmissions: vi.fn(),
}));

describe("useEmission Hook", () => {
  test("should fetch emissions successfully", async () => {
    // Mock successful API response
    (estimateEmissions as jest.Mock).mockResolvedValue({ co2e: 120, co2e_unit: "kg" });

    const { result } = renderHook(() => useEmission());

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    await act(async () => {
      await result.current.getEmissions(100, startDate, endDate);
    });

    expect(result.current.emissions).toBe(120);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  test("should handle API errors", async () => {
    // Mock API failure
    (estimateEmissions as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useEmission());

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    await act(async () => {
      await result.current.getEmissions(100, startDate, endDate);
    });

    expect(result.current.emissions).toBeNull();
    expect(result.current.error).toBe("Failed to retrieve emissions data.");
    expect(result.current.loading).toBe(false);
  });

  test("should set loading state during API call", async () => {
    (estimateEmissions as jest.Mock).mockResolvedValue({ co2e: 150, co2e_unit: "kg" });

    const { result } = renderHook(() => useEmission());

    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-01-31');

    act(() => {
      result.current.getEmissions(100, startDate, endDate);
    });

    expect(result.current.loading).toBe(true);
  });
});
