import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const Navbar = () =>{
    const {user, logout } = useAuth();

    return(
        <nav className="bg-gray-900 text-white p-4 flex justify-between">
            <div>
                <Link to="/" className="text-lg font-bold">
                CO₂ Offset Calculator</Link>
            </div>
            <div className="flex gap-4">
                <Link to="/" className="hover:underline">Home</Link>
                {user ? (
                <>
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/results" className="hover:underline">Results</Link>
                    <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
                </>
                ) : (
                <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">Login</Link>
                )}
            </div>

        </nav>
    )
}

export default Navbar;