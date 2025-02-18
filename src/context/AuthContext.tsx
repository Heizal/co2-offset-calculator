import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string | null;
  email: string | null;
  photo: string | null;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/* import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {auth, provider} from "../config/firebase";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";

interface User{
  name: string | null;

}

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }, []);
  
    const login = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        setUser(user);
      } catch (error) {
        console.error("Login Error:", error);
      }
    };
  
    const logout = async () => {
      await signOut(auth);
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext); */