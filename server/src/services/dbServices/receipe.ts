import { asc, Column, eq, is, sql, ilike, or, and, exists } from "drizzle-orm";
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
              averageRating: sql<number>`
                COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id = ${recipes.id}),0)
              `.as("average_rating"),
              isSaved: sql<boolean>`EXISTS (
                SELECT 1 FROM saved_recipes
                WHERE saved_recipes.recipe_id = ${recipes.id}
                AND saved_recipes.user_id = ${userId || null}
              )`.as("is_saved"),
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

  static addNewRecipe = async (recipeData: NewRecipeDTO, ingredientsUsed: IngredientUsageDTO[], preparationStepsIncluded: PreparationStepDTO[]) => {
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

  static getAllIngredients = async () => {
    try {
      const recipes = await postgresdb.query.ingredients.findMany();
      return recipes;
    } catch (error: any) {
      throw new Error(`Error fetching all Receipes: ${error.message}`);
    }
  };

  static getRecipes = async (ingredientNames?: string[], title?: string, page?: number, pageSize?: number, userId?: number) => {
    try {
      const offset = ((page || 1) - 1) * (pageSize || 10);
      const ingredientConditions = ingredientNames?.map((name) => ilike(ingredients.name, sql`'%' || ${name} || '%'`));
      const titleCondition = title ? ilike(recipes.title, sql`'%' || ${title} || '%'`) : undefined;
      let whereConditions: any[] = [];
      if (ingredientConditions && ingredientConditions.length > 0) {
        whereConditions.push(
          exists(
            postgresdb
              .select()
              .from(recipeIngredients)
              .innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
              .where(and(eq(recipeIngredients.recipeId, recipes.id), or(...ingredientConditions)))
          )
        );
      }
      if (titleCondition) {
        whereConditions.push(titleCondition);
      }
      const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const matchingRecipes = await postgresdb.query.recipes.findMany({
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
          averageRating: sql<number>`
            COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id = ${recipes.id}),0)
          `.as("average_rating"),
          matchingIngredientsCount: sql<number>`
          (SELECT COUNT(*)
              FROM recipe_ingredients
              INNER JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id
              WHERE recipe_ingredients.recipe_id = ${recipes.id} 
              AND ingredients.name ILIKE ANY (
                ARRAY[${sql.join(
                  (ingredientNames || []).map((name) => sql`'%' || ${name} || '%'`),
                  sql`, `
                )}]::text[]
              )
            )
        `.as("maychingIngredients"),
          matchPercentage: sql<number>`
            Round((SELECT COUNT(*)::DECIMAL
              FROM recipe_ingredients
              INNER JOIN ingredients ON ingredients.id = recipe_ingredients.ingredient_id
              WHERE recipe_ingredients.recipe_id = ${recipes.id} 
              AND ingredients.name ILIKE ANY (
                ARRAY[${sql.join(
                  (ingredientNames || []).map((name) => sql`'%' || ${name} || '%'`),
                  sql`, `
                )}]::text[]
              )
            ) / NULLIF(${ingredientNames?.length || 0}, 0) * 100, 2)
          `.as("match_percentage"),
          isSaved: sql<boolean>`EXISTS (
            SELECT 1 FROM saved_recipes
            WHERE saved_recipes.recipe_id = ${recipes.id}
            AND saved_recipes.user_id = ${userId || null}
          )`.as("is_saved"),
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
        where: whereClause,
        orderBy: sql`match_percentage DESC, average_rating DESC`,
        limit: pageSize,
        offset: offset,
      });

      return matchingRecipes;
    } catch (error: any) {
      console.log("ERROR---", error);
      throw new Error(`Error searching recipes by ingredients: ${error.message}`);
    }
  };

  static getRecipeById = async (recipeId: number, userId?: number) => {
    try {

      const matchingRecipe = await postgresdb.query.recipes.findMany({
        where:eq(recipes.id, recipeId),
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
          averageRating: sql<number>`
            COALESCE((SELECT AVG(rating) FROM reviews WHERE recipe_id = ${recipes.id}),0)
          `.as("average_rating"),
          isSaved: sql<boolean>`EXISTS (
            SELECT 1 FROM saved_recipes
            WHERE saved_recipes.recipe_id = ${recipes.id}
            AND saved_recipes.user_id = ${userId || null}
          )`.as("is_saved"),
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
        }
      });

      return matchingRecipe[0];
    } catch (error: any) {
      console.log("ERROR---", error);
      throw new Error(`Error searching recipes by ingredients: ${error.message}`);
    }
  };

  static saveRecipe = async (userId: number, recipeId: number) => {
    try {
      // first check for combination
      const alreadysavedRecipe = await postgresdb.query.savedRecipes.findMany({
        columns: {
          id: true,
          userId: true,
          recipeId: true,
        },
        where: and(eq(savedRecipes.userId, userId), eq(savedRecipes.recipeId, recipeId)),
      });

      if (alreadysavedRecipe.length) {
        throw new Error("Recipe is already saved");
      }

      await postgresdb.insert(savedRecipes).values({
        userId: userId,
        recipeId: recipeId,
      });
    } catch (error: any) {
      throw new Error(`Error saving Recipe: ${error.message}`);
    }
  };
}
