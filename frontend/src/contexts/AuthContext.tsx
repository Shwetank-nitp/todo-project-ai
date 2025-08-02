import { host } from "@/cofig";
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  fullname: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (
    fullname: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${host}/v1/auth/info`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.data) {
            setUser({ ...json.data, token: token });
          } else {
            console.log(json.error);
          }
        })
        .catch((e) => console.warn(e));
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const response = await fetch(`${host}/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const json = await response.json();

    const existingUser = json?.data;

    if (existingUser) {
      setUser({
        id: existingUser.id,
        username: existingUser.username,
        fullname: existingUser.fullname,
        token: existingUser.token,
      });
      localStorage.setItem("token", existingUser.token);
      return true;
    }
    return false;
  };

  const signup = async (
    fullname: string,
    username: string,
    password: string
  ): Promise<boolean> => {
    const response = await fetch(`${host}/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        fullname,
      }),
    });

    const json = await response.json();

    const existingUser = json?.error;

    if (existingUser) {
      console.warn(existingUser);
      return false;
    }

    const newUser = json.data;

    const userData = {
      id: newUser.id,
      username: newUser.username,
      fullname: newUser.fullname,
      token: newUser.token,
    };

    setUser(userData);
    localStorage.setItem("token", newUser.token);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
