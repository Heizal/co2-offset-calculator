import {auth, provider } from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () =>{
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () =>{
        try{
            const result = await signInWithPopup(auth,provider);
            const user = {
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL
            };

            console.log("User:", user);

            setUser(user); //Save user data in authcontext

            navigate("/dashboard") //navigates to dashboard after login
        } catch (error){
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-xl font-bold mb-4 text-green-700">Sign in with Google</h2>
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Sign in with Google
          </button>
        </div>
    );
}

export default Login;