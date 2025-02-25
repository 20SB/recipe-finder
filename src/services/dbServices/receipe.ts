import { asc, Column, eq, is, sql } from "drizzle-orm";
import postgresdb from "../../config/db";
import { ingredients, ingredientsUsedInPrepStep, preparationSteps, recipeIngredients, recipes, reviews, savedRecipes } from "../../models/schema";
import { CreatedRecipeResponse, IngredientUsageDTO, NewRecipeDTO, PreparationStepDTO } from "../../helpers/interfaces";

export default class Receipe {
  static getSavedRecipesOfUser = async (userId: number) => {
    try {
      const savedRecipesList = await postgresdb.query.savedRecipes.findMany({
        where: eq(savedRecipes.userId, userId),
        columns: {
          id: true,
        },
        with: {
          recipe: {
            columns: {
              id: true,
              title: true,
              description: true,
              imageUrl: true,
              cuisineType: true,
              preparationTime: true,
              cookingMethod: true,
              difficultyLevel: true,
              calorieCount: true,
              source: true,
              createdAt: true,
              updatedAt: true,
            },
            extras: {
              averageRating: sql<number>`(SELECT AVG(rating) FROM reviews WHERE recipe_id = ${recipes.id})`.as("average_rating"),
            },
            with: {
              createdByUser: {
                columns: {
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
              recipeIngredients: {
                columns: {
                  quantity: true,
                  isRequired: true,
                },
                with: {
                  ingredient: {
                    columns: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
              },
              preparationSteps: {
                columns: {
                  stepNo: true,
                  stepDescription: true,
                },
                with: {
                  ingredientsUsed: {
                    columns: {
                      quantity: true,
                      isRequired: true,
                    },
                    with: {
                      ingredient: {
                        columns: {
                          id: true,
                          name: true,
                          image: true,
                        },
                      },
                    },
                  },
                },
                orderBy: asc(preparationSteps.stepNo),
              },
              reviews: {
                columns: {
                  rating: true,
                  reviewText: true,
                  createdAt: true,
                },
                with: {
                  reviewer: {
                    columns: {
                      name: true,
                      email: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return savedRecipesList;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error while getting user's saved recipes: ${error.message}`);
    }
  };

  static addNewRecipe  = async (recipeData: NewRecipeDTO, ingredientsUsed: IngredientUsageDTO[], preparationStepsIncluded: PreparationStepDTO[]) => {
    try {
      return await postgresdb.transaction(async (tx) => {
        // Insert main recipe
        const [recipe] = await tx
          .insert(recipes)
          .values({
            title: recipeData.title,
            description: recipeData.description,
            imageUrl: recipeData.imageUrl,
            cuisineType: recipeData.cuisineType,
            preparationTime: recipeData.preparationTime,
            cookingMethod: recipeData.cookingMethod,
            difficultyLevel: recipeData.difficultyLevel,
            calorieCount: recipeData.calorieCount,
            source: recipeData.source,
            createdBy: recipeData.createdByUserId,
          })
          .returning();

        // Insert recipe ingredients
        const recipeIngredientsData = ingredientsUsed.map((item: IngredientUsageDTO) => ({
          recipeId: recipe.id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          isRequired: item.isRequired,
        }));
        const ingredientsInserted = await tx.insert(recipeIngredients).values(recipeIngredientsData).returning();
        let prepStepsInserted = [];

        // Insert preparation steps
        for (const stepData of preparationStepsIncluded) {
          const [prepStep] = await tx
            .insert(preparationSteps)
            .values({
              recipeId: recipe.id,
              stepNo: stepData.stepNo,
              stepDescription: stepData.stepDescription,
            })
            .returning();

          // Insert step ingredients
          const prepStepIngredients = stepData.ingredientsUsed.map((item: IngredientUsageDTO) => ({
            preparationStepId: prepStep.id,
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            isRequired: item.isRequired,
          }));

          let ingredientsUsedInPrepStepInserted;
          if (prepStepIngredients.length > 0) {
            ingredientsUsedInPrepStepInserted = await tx.insert(ingredientsUsedInPrepStep).values(prepStepIngredients).returning();
          }
          prepStepsInserted.push({
            ...prepStep,
            ingredientsUsed: ingredientsUsedInPrepStepInserted,
          });
        }

        return { ...recipe, recipeIngredients: ingredientsInserted, preparationSteps: prepStepsInserted };
      });
    } catch (error: any) {
      throw new Error(`Recipe creation failed: ${error.message}`);
    }
  };

  static addNewIngredients = async (input: any) => {
    try {
      let ingredient = await postgresdb
        .insert(ingredients)
        .values({
          name: input.name,
          image: input.image,
        })
        .returning();

      return ingredient;
    } catch (error: any) {
      throw new Error(`Error While adding new Receipe: ${error.message}`);
    }
  };
}
