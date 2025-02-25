import { ReceipeSources } from "./enums";

// src\helpers\interfaces.ts

// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
}

// Register user interface
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// Main recipe creation interface
export interface NewRecipeDTO {
  title: string;
  description?: string;
  imageUrl?: string;
  cuisineType?: string;
  preparationTime?: number;
  cookingMethod?: string;
  difficultyLevel?: string;
  calorieCount?: number;
  source: ReceipeSources;
  createdByUserId?: number;
}

// Ingredient usage interface (used in both recipe and preparation steps)
export interface IngredientUsageDTO {
  ingredientId: number;
  quantity?: string;
  isRequired: boolean;
}

// Preparation step interface
export interface PreparationStepDTO {
  stepNo: number;
  stepDescription: string;
  ingredientsUsed: IngredientUsageDTO[];
}

export interface CreatedRecipeResponse {
  // From recipes table
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  cuisineType: string | null;
  preparationTime: number | null;
  cookingMethod: string | null;
  difficultyLevel: string | null;
  calorieCount: number | null;
  createdBy: number | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;

  // Added relations
  recipeIngredients: Array<{
    id: number;
    recipeId: number;
    ingredientId: number;
    quantity: string | null;
    isRequired: boolean;
  }>;

  preparationSteps: Array<{
    // From preparationSteps table
    id: number;
    recipeId: number;
    stepNo: number;
    stepDescription: string;

    // Nested ingredients
    ingredientsUsed: Array<{
      id: number;
      preparationStepId: number;
      ingredientId: number;
      quantity: string | null;
      isRequired: boolean;
    }>;
  }>;
}
