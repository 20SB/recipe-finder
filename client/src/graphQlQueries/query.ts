"use client";

import { request, gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation LoginUser($userInput: loginUserInput!) {
    loginUser(userInput: $userInput) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

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
          title
          id
          averageRating
          calorieCount
          description
          imageUrl
          preparationTime
          cuisineType
          difficultyLevel
          isSaved
          recipeIngredients {
            quantity
            isRequired
            ingredient {
              name
              image
            }
          }
        }
      }
    }
  }
`;

export const GETBESTRECIPES_QUERY = gql`
  query GetRecipes($clientInput: getRecipesInput!) {
    getRecipes(input: $clientInput) {
      title
      id
      averageRating
      calorieCount
      description
      imageUrl
      preparationTime
      cuisineType
      difficultyLevel
      isSaved
      recipeIngredients {
        quantity
        isRequired
        ingredient {
          name
          image
        }
      }
    }
  }
`;

export const GETRECIPEDATA_QUERY = gql`
  query GetRecipeData($recipeId: ID!) {
    getRecipeData(recipeId: $recipeId) {
      title
      id
      description
      imageUrl
      cuisineType
      preparationTime
      cookingMethod
      difficultyLevel
      calorieCount
      createdBy {
        name
        email
        avatar
        id
      }
      source
      recipeIngredients {
        ingredient {
          name
          image
          id
        }
        quantity
        isRequired
      }
      preparationSteps {
        stepNo
        stepDescription
        ingredientsUsed {
          quantity
          isRequired
          ingredient {
            image
            name
            id
          }
        }
      }
      reviews {
        id
        reviewer {
          name
          email
          avatar
          id
        }
        rating
        reviewText
        createdAt
      }
      averageRating
      isSaved
      createdAt
      updatedAt
    }
  }
`;
