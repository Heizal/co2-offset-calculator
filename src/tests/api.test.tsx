import axios from "axios";
import { describe, test, expect, vi } from "vitest";
import { fetchEmissionFactor, estimateEmissions } from "../services/api";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

beforeEach(() => {
  vi.clearAllMocks(); 
});

describe("API Service - fetchEmissionFactor", () => {
  test("should return the first matching emission factor on success", async () => {
    const mockEmissionFactor = { id: "factor_1", name: "Electricity Emission Factor", co2e: 0.5 };

    mockedAxios.get.mockResolvedValueOnce({ data: { results: [mockEmissionFactor] } });

    const result = await fetchEmissionFactor();

    expect(result).toEqual(mockEmissionFactor);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  test("should return null if no emission factor is found", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });

    const result = await fetchEmissionFactor();

    expect(result).toBeNull();
  });

  test("should return null on API error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchEmissionFactor();

    expect(result).toBeNull();
  });
});

describe("API Service - estimateEmissions", () => {
  test("should return emission data on success", async () => {
    const mockEmissionFactor = { id: "factor_1", name: "Electricity Emission Factor", co2e: 0.5 };
    const mockResponse = { co2e: 200, co2e_unit: "kg" };

    mockedAxios.get.mockResolvedValueOnce({ data: { results: [mockEmissionFactor] } });
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await estimateEmissions(100);

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });

  test("should return null if emission factor retrieval fails", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { results: [] } });

    const result = await estimateEmissions(100);

    expect(result).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledTimes(0);
  });

  test("should return null if API request fails", async () => {
    const mockEmissionFactor = { id: "factor_1", name: "Electricity Emission Factor", co2e: 0.5 };

    mockedAxios.get.mockResolvedValueOnce({ data: { results: [mockEmissionFactor] } });
    mockedAxios.post.mockRejectedValueOnce(new Error("API error"));

    const result = await estimateEmissions(100);

    expect(result).toBeNull();
  });
});


