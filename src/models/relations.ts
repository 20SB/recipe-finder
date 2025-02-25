// \src\models\relations.ts
import { relations } from "drizzle-orm";
import { ingredients, ingredientsUsedInPrepStep, preparationSteps, recipeIngredients, recipes, reviews, savedRecipes, users } from "./schema";

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  reviews: many(reviews),
  savedRecipes: many(savedRecipes),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  createdByUser: one(users, { fields: [recipes.createdBy], references: [users.id] }),
  recipeIngredients: many(recipeIngredients),
  preparationSteps: many(preparationSteps),
  reviews: many(reviews),
  savedByUsers: many(savedRecipes),
}));

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipes: many(recipeIngredients),
  usedInPrep: many(ingredientsUsedInPrepStep),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeIngredients.recipeId], references: [recipes.id] }),
  ingredient: one(ingredients, { fields: [recipeIngredients.ingredientId], references: [ingredients.id] }),
}));

export const preparationStepsRelations = relations(preparationSteps, ({ one, many }) => ({
  recipe: one(recipes, { fields: [preparationSteps.recipeId], references: [recipes.id] }),
  ingredientsUsed: many(ingredientsUsedInPrepStep),
}));

export const ingredientsUsedInPrepStepRelations = relations(ingredientsUsedInPrepStep, ({ one }) => ({
  prepStep: one(preparationSteps, { fields: [ingredientsUsedInPrepStep.preparationStepId], references: [preparationSteps.id] }),
  ingredient: one(ingredients, { fields: [ingredientsUsedInPrepStep.ingredientId], references: [ingredients.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  reviewer: one(users, { fields: [reviews.userId], references: [users.id] }),
  recipe: one(recipes, { fields: [reviews.recipeId], references: [recipes.id] }),
}));

export const savedRecipesRelations = relations(savedRecipes, ({ one }) => ({
  user: one(users, { fields: [savedRecipes.userId], references: [users.id] }),
  recipe: one(recipes, { fields: [savedRecipes.recipeId], references: [recipes.id] }),
}));
