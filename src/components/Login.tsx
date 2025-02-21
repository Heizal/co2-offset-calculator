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
        <div className="h-screen w-screen bg-black flex items-start justify-center relative px-4">
          {/* Overlay Glow Effect */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Login Box (Not Fully Centered) */}
          <motion.div
            className="relative z-10 mt-32 md:mt-48 bg-white/10 backdrop-blur-xl shadow-lg rounded-xl px-6 py-6 md:px-10 md:py-8 w-full max-w-sm md:max-w-md border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Heading */}
            <h2 className="text-2xl font-semibold text-white mb-2 text-center">
              Login to <span className="text-orange-400">CO₂ Tracker</span>
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Sign in with your Google account to continue.
            </p>

            {/* Google Sign-In Button */}
            <button
              onClick={handleLogin}
              className="flex items-center justify-center w-full gap-3 bg-white/20 border border-white/30 px-6 py-3 rounded-full text-white shadow-md hover:bg-white/30 transition duration-300"
            >
              <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
              <span className="text-sm font-medium">Sign in with Google</span>
            </button>
          </motion.div>
        </div>
      
    
    );
}

export default Login;