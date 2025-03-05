"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { gql, request } from "graphql-request";
import { getToken, removeToken, setToken } from "@/lib/auth";
import { fetchBestRatedRecipes, fetchUserDataById } from "@/graphQlQueries/method";
import { LOGIN_MUTATION } from "@/graphQlQueries/query";
import { LoginFormData } from "@/app/login/page";
import { useRouter } from "next/navigation";

const RecipeContext = createContext<any | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bestRecipes, setBestRecipes] = useState<any[]>([]);

  useEffect(() => {
    const token = getToken();
    fetchBestRecipes(token);
  }, []);

  


  const fetchBestRecipes = async (token:any) => {
    setLoading(true);
    try {
      const bastRecipes = await fetchBestRatedRecipes(token);
      setBestRecipes(bastRecipes);
      console.log("bastRecipes:", bastRecipes);
    } catch (error: any) {
      throw new Error(`Error fetching best recipes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return <RecipeContext.Provider value={{ loading, bestRecipes }}>{children}</RecipeContext.Provider>;
};

// Custom Hook to use RecipeContext
export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider");
  }
  return context;
};
