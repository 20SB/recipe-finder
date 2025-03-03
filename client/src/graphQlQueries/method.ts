"use client";

import { request, gql } from "graphql-request";
import { GETUSERDATA_QUERY } from "./query";

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
