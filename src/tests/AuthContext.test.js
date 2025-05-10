import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";
const MockComponent = () => {
    const { user } = useAuth();
    return _jsx("div", { children: user ? "Logged In" : "Not Logged In" });
};
//Verifys the default state is Not Logged In
//Ensures AuthProvider initializes properly
describe("AuthContext", () => {
    test("renders without errors", () => {
        render(_jsx(AuthProvider, { children: _jsx(MockComponent, {}) }));
        expect(screen.getByText("Not Logged In")).toBeInTheDocument();
    });
});
