"use client";

import { request, gql } from "graphql-request";

export const GETUSERDATA_QUERY = gql`
  query GetUsersDataById($userId: ID) {
    getUsersDataById(id: $userId) {
      user {
        id
        name
        email
        avatar
      }
      savedRecipes {
        recipe {
          id
          title
          description
          imageUrl
          cuisineType
          preparationTime
          cookingMethod
          difficultyLevel
          calorieCount
          createdAt
          updatedAt
          averageRating
        }
      }
    }
  }
`;
