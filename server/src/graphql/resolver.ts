// src\resolver.ts
import { ApolloError } from "apollo-server";
import { User, RegisterUser, NewRecipeDTO, IngredientUsageDTO, PreparationStepDTO, CreatedRecipeResponse } from "../helpers/interfaces";
import { generateToken, isAuthenticated } from "../helpers/auth";
import dbService from "../services/dbServices";
import { get } from "http";

export const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL!",
    getUsersDataById: async (_: any, { id }: { id: number }, context: any) => {
      try {
        const authenticatedUser: { userId: number } = isAuthenticated(context);
        const user: any = await dbService.User.userById(authenticatedUser.userId);
        const savedRecipes = await dbService.Receipe.getSavedRecipesOfUser(user.id);
        return { user: user, savedRecipes: savedRecipes };
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },
    getRecipes: async (_: any, { input }: { input: { ingredients?: string[]; title?: string; page?: number; pageSize?: number } }, context: any) => {
      try {
        const authenticatedUser: { userId: number } = context.user;
        const { ingredients, title, page, pageSize } = input;
        const recipes = await dbService.Receipe.getRecipes(ingredients, title, page, pageSize, authenticatedUser?.userId);
        console.log("recipes-->", recipes);
        // return "success fetching recipes by ingredients";
        return recipes;
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },
    getRecipeData: async (_: any, { recipeId }: { recipeId: number }, context: any) => {
      try {
        const authenticatedUser: { userId: number } = context.user;
        const recipe = await dbService.Receipe.getRecipeById(recipeId, authenticatedUser?.userId);
        console.log("recipe-->", recipe);
        // return "success fetching recipe by ingredients";
        return recipe;
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },
    getAllIngredients: async () => {
      try {
        const ingredients = await dbService.Receipe.getAllIngredients();
        return ingredients;
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },
  },
  Mutation: {
    registerUser: async (_: any, { userInput }: { userInput: RegisterUser }) => {
      try {
        const user: User = await dbService.User.registerUser(userInput);
        const token = generateToken({ userId: user.id });
        return { user: user, token: token };
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },

    loginUser: async (_: any, { userInput }: { userInput: { email: string; password: string } }) => {
      try {
        const user: User = await dbService.User.loginUser(userInput.email, userInput.password);
        const token = generateToken({ userId: user.id });
        return { user: user, token: token };
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },

    addNewIngredients: async (_: any, { input }: { input: any }, context: any) => {
      try {
        const ingredient = await dbService.Receipe.addNewIngredients(input);
        console.log("ingredient added-->", ingredient);
        return "success adding ingredient";
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },

    addNewRecipe: async (_: any, { recipeData, ingredientsUsed, preparationStepsIncluded }: { recipeData: NewRecipeDTO; ingredientsUsed: IngredientUsageDTO[]; preparationStepsIncluded: PreparationStepDTO[] }, context: any) => {
      try {
        const recipe = await dbService.Receipe.addNewRecipe(recipeData, ingredientsUsed, preparationStepsIncluded);
        console.dir(recipe, { depth: null });
        return "success adding recipe";
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },

    saveRecipe: async (_: any, { recipeId }: { recipeId: number }, context: any) => {
      try {
        const authenticatedUser: { userId: number } = isAuthenticated(context);
        const recipe = await dbService.Receipe.saveRecipe(authenticatedUser.userId, recipeId);
        console.dir(recipe, { depth: null });
        return "success saving recipe";
      } catch (error: any) {
        throw new ApolloError(error.message || "An unexpected error occurred", error.code || "INTERNAL_ERROR");
      }
    },
  },
};
