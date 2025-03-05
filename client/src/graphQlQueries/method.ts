"use client";

import { request, gql } from "graphql-request";
import { GETBESTRECIPES_QUERY, GETRECIPEDATA_QUERY, GETUSERDATA_QUERY } from "./query";

export const fetchUserDataById = async (token: string, userId: string | null) => {
  try {
    const response: any = await request(
      "http://localhost:4000/api/graphql",
      GETUSERDATA_QUERY,
      {
        userId: userId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.getUsersDataById || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchBestRatedRecipes = async (token: any) => {
  console.log("token1:", token);

  try {
    const response: any = await request(
      "http://localhost:4000/api/graphql",
      GETBESTRECIPES_QUERY,
      {
        clientInput: {},
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.getRecipes || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchRecipeData = async (recipeId: number, token: any) => {
  console.log("token1:", token);

  try {
    const response: any = await request(
      "http://localhost:4000/api/graphql",
      GETRECIPEDATA_QUERY,
      {
        recipeId: recipeId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    return response.getRecipes || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
