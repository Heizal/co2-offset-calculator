import {render, screen} from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

const MockComponent = () =>{
    const {user} = useAuth();
    return <div>{user ? "Logged In": "Not Logged In"}</div>
};

//Verifys the default state is Not Logged In
//Ensures AuthProvider initializes properly
describe("AuthContext", () =>{
    test("renders without errors", () =>{
        render(
            <AuthProvider>
                <MockComponent/>
            </AuthProvider>
        );
        expect(screen.getByText("Not Logged In")).toBeInTheDocument();
    }) 

})