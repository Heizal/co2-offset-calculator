import {auth, provider } from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import googleLogo from "../assets/google.png";

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
      <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative px-6"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=600')",
      }}
    >
          {/* Main Content */}
          <div className="relative z-10 text-center max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-[#d35400] leading-tight mb-4">
              3.5<br />
              <span className="text-4xl md:text-5xl">Gigaton CO₂e</span>
              <span className="block text-xl md:text-2xl font-light text-[#a3542a] mt-1">
                / Year
              </span>
            </h1>

            <p className="text-[#fff] text-lg md:text-xl leading-relaxed mb-8">
              The energy we use every day—from heating our homes to powering our devices—directly contributes to global CO₂ emissions. Electricity production is one of the largest sources of greenhouse gases. This app helps you track and reduce your footprint.
            </p>

            {/* Google Sign-In Button */}
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-3 bg-[#d35400] hover:bg-[#b84300] px-6 py-3 text-white rounded-full transition text-sm font-medium shadow-md mx-auto"
            >
              <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
        </div>
    );
}

export default Login;