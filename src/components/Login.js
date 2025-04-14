import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import googleLogo from "../assets/google.png";
const Login = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            };
            console.log("User:", user);
            setUser(user); //Save user data in authcontext
            navigate("/dashboard"); //navigates to dashboard after login
        }
        catch (error) {
            console.error("Login Error:", error);
        }
    };
    return (_jsx("div", { className: "min-h-screen w-full bg-cover bg-center flex items-center justify-center relative px-6", style: {
            backgroundImage: "url('https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=600')",
        }, children: _jsxs("div", { className: "relative z-10 text-center max-w-xl", children: [_jsxs("h1", { className: "text-5xl md:text-6xl font-bold text-[#d35400] leading-tight mb-4", children: ["3.5", _jsx("br", {}), _jsx("span", { className: "text-4xl md:text-5xl", children: "Gigaton CO\u2082e" }), _jsx("span", { className: "block text-xl md:text-2xl font-light text-[#a3542a] mt-1", children: "/ Year" })] }), _jsx("p", { className: "text-[#fff] text-lg md:text-xl leading-relaxed mb-8", children: "The energy we use every day\u2014from heating our homes to powering our devices\u2014directly contributes to global CO\u2082 emissions. Electricity production is one of the largest sources of greenhouse gases. This app helps you track and reduce your footprint." }), _jsxs("button", { onClick: handleLogin, className: "flex items-center justify-center gap-3 bg-[#d35400] hover:bg-[#b84300] px-6 py-3 text-white rounded-full transition text-sm font-medium shadow-md mx-auto", children: [_jsx("img", { src: googleLogo, alt: "Google Logo", className: "w-5 h-5" }), "Sign in with Google"] })] }) }));
};
export default Login;
