import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "./Navbar";
//Ensures Navbar renders properly
//Checks the presence of Home and Title Link
describe("Navbar", () => {
    test("renders navbar links", () => {
        render(_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(Navbar, {}) }) }));
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
});
