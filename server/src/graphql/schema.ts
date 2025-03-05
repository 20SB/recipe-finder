// src\graphql\schema.ts
import { gql } from 'apollo-server';
import { ReceipeSources } from '../helpers/enums';

export const typeDefs = gql`
  enum ReceipeSources {
    ${Object.values(ReceipeSources).join('\n')}
  }

  type User {
    id: ID
    name: String
    email: String
    avatar: String
  }

  type RegisterOrLoginOutput {
    user: User
    token: String
  }

  type Recipe {
    id: ID
    title: String!
    description: String
    imageUrl: String
    cuisineType: String
    preparationTime: Int
    cookingMethod: String
    difficultyLevel: String
    calorieCount: Int
    createdBy: User
    source: ReceipeSources
    recipeIngredients: [RecipeIngredient]
    preparationSteps: [PreparationStep]
    reviews: [Review]
    averageRating: Float
    matchPercentage: Float
    matchingIngredientsCount: Int
    isSaved: Boolean
    createdAt: String
    updatedAt: String
  }

  type Ingredient {
    id: ID
    name: String!
    image: String
  }

  type RecipeIngredient {
    recipe: Recipe
    ingredient: Ingredient!
    quantity: String
    isRequired: Boolean!
  }

  type IngredientsUsedInPrepStep {
    prepStep: PreparationStep
    ingredient: Ingredient!
    quantity: String
    isRequired: Boolean
  }

  type PreparationStep {
    id: ID
    stepNo: Int!
    stepDescription: String!
    ingredientsUsed: [IngredientsUsedInPrepStep]
  }

  type Review {
    id: ID
    recipe: Recipe
    reviewer: User!
    rating: Int!
    reviewText: String
    createdAt: String!
  }

  type SavedRecipe {
    id: ID
    user: User
    recipe: Recipe
  }
    
  type UsersData {
    user: User
    savedRecipes: [SavedRecipe]
  }

  type Query {
    hello: String
    getAllIngredients: [Ingredient]
    getUsersDataById(id: ID): UsersData
    getRecipes(input: getRecipesInput!): [Recipe]
    getRecipeData(recipeId: ID!): Recipe
  }
    
  type Mutation {
    registerUser(userInput: RegisterUserInput): RegisterOrLoginOutput
    loginUser(userInput: loginUserInput): RegisterOrLoginOutput

    addNewRecipe(
      recipeData: NewRecipeInput!
      ingredientsUsed: [IngredientUsageInput!]!
      preparationStepsIncluded: [PreparationStepInput!]!
    ): String

    addNewIngredients(input: NewIngredientInput!): String
    saveRecipe(recipeId: ID!): String
  }

  input RegisterUserInput {
    name: String!
    email: String!
    password: String!
    avatar: String
  }

  input loginUserInput {
    email: String!
    password: String!
  }

  input NewRecipeInput {
    title: String!
    description: String
    imageUrl: String
    cuisineType: String
    preparationTime: Int
    cookingMethod: String
    difficultyLevel: String
    calorieCount: Int
    source: ReceipeSources!
    createdByUserId: Int
  }

  input IngredientUsageInput {
    ingredientId: Int!
    quantity: String
    isRequired: Boolean!
  }

  input PreparationStepInput {
    stepNo: Int!
    stepDescription: String!
    ingredientsUsed: [IngredientUsageInput!]!
  }

  input NewIngredientInput {
    name: String!
    image: String
  }

  input getRecipesInput {
    ingredients: [String!]
    title: String
    pageSize: Int
    page: Int
  }

`;