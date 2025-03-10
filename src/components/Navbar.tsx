import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", path: "/dashboard" }
];

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left Section: Logo & Navigation */}
      <div className="flex items-center space-x-8">

        {/* Navigation Links */}
        <div className="flex space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Section: Notifications & User */}
      <div className="flex items-center space-x-6">
        {/* User Profile & Logout */}
        {user ? (
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center space-x-2 focus:outline-none">
              <span className="text-gray-300">{user.name}</span>
              <img
                src={user.photo || "https://cdn-icons-png.flaticon.com/128/1711/1711976.png"}
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-1">
              <MenuItem>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        ) : (
          <Link
            to="/login"
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
