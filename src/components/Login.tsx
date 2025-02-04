import {auth, provider } from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';

const Login = () =>{
    const handleLogin = async () =>{
        try{
            const result = await signInWithPopup(auth,provider);
            console.log("User:", result.user);
        } catch (error){
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-xl font-bold mb-4">Sign in with Google</h2>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Sign in with Google
          </button>
        </div>
    );
}

export default Login;