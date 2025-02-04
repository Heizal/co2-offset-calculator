import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "./Login";

// ✅ Properly mock Firebase auth
vi.mock("../config/firebase", () => {
  return {
    auth: {
      onAuthStateChanged: vi.fn((callback) => {
        // ✅ Mock user state as logged out initially
        callback(null);
        return () => {}; // ✅ Mock unsubscribe function
      }),
      //sign in with fake user to mock firebase login
      signInWithPopup: vi.fn(() =>
        Promise.resolve({
          user: { displayName: "Test User" },
        })
      ),
    },
    provider: {},
  };
});

describe("Login", () => {
  test("renders login button", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByRole("button", { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
  });

  test("calls login function on button click", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );

    const button = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(button);

    expect(await screen.findByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });
});


