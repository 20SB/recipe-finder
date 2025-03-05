"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { gql, request } from "graphql-request";
import { getToken, removeToken, setToken } from "@/lib/auth";
import { fetchUserDataById } from "@/graphQlQueries/method";
import { LOGIN_MUTATION } from "@/graphQlQueries/query";
import { LoginFormData } from "@/app/login/page";
import { useRouter } from "next/navigation";

type UserType = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type SavedRecipeType = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
};

type UserContextType = {
  user: UserType | null;
  savedRecipes: any[];
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchUserDataById(token, null).then((userData) => {
      console.log("userData------:", userData);
      setUser(userData.user);
      setSavedRecipes(userData.savedRecipes);
    });

    setLoading(false);
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const logout = () => {
    setUser(null);
    setSavedRecipes([]);
    removeToken();
    // window.location.reload();
  };

  const login = async (data: LoginFormData) => {
    try {
      const response: any = await request("http://localhost:4000/api/graphql", LOGIN_MUTATION, {
        userInput: {
          email: data.email,
          password: data.password,
        },
      });

      console.log("login successful:", response);
      // Handle storing token and redirecting the user

      if (response.loginUser?.token) {
        setToken(response.loginUser?.token, 24);
        setUser(response.loginUser?.user);
        await fetchUserData();
        router.push("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return <UserContext.Provider value={{ user, savedRecipes, loading, login, logout }}>{children}</UserContext.Provider>;
};

// Custom Hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
