import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
const navigation = [
    { name: "Dashboard", path: "/dashboard" }
];
const Navbar = () => {
    const { user, logout } = useAuth();
    return (_jsxs("nav", { className: "bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md", children: [_jsx("div", { className: "flex items-center space-x-8", children: _jsx("div", { className: "flex space-x-6", children: navigation.map((item) => (_jsx(Link, { to: item.path, className: "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition", children: item.name }, item.name))) }) }), _jsx("div", { className: "flex items-center space-x-6", children: user ? (_jsxs(Menu, { as: "div", className: "relative", children: [_jsxs(MenuButton, { className: "flex items-center space-x-2 focus:outline-none", children: [_jsx("span", { className: "text-gray-300", children: user.name }), _jsx("img", { src: user.photo || "https://cdn-icons-png.flaticon.com/128/1711/1711976.png", alt: "Profile", className: "h-8 w-8 rounded-full" })] }), _jsx(MenuItems, { className: "absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-1", children: _jsx(MenuItem, { children: _jsx("button", { onClick: logout, className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Logout" }) }) })] })) : (_jsx(Link, { to: "/login", className: "text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition", children: "Login" })) })] }));
};
export default Navbar;
