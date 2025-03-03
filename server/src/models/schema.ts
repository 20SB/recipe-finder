// \src\models\schema.ts
import { boolean, index, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ReceipeSources } from "../helpers/enums";
import { relations } from "drizzle-orm";

// Enum for recipe sources
export const receipe_sources = pgEnum("receipe_source", Object.values(ReceipeSources) as [string, ...string[]]);

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  avatar: varchar("avatar", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Recipes Table
export const recipes = pgTable(
  "recipes",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    cuisineType: text("cuisine_type"),
    preparationTime: integer("preparation_time"),
    cookingMethod: text("cooking_method"),
    difficultyLevel: text("difficulty_level"),
    calorieCount: integer("calorie_count"),
    createdBy: integer("created_by")
      .references(() => users.id, { onDelete: "cascade" }),
    source: receipe_sources("receipe_source").default(ReceipeSources.ADMIN).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    titleIndex: index("title_index").on(table.title),
  })
);

// Ingredients Table
export const ingredients = pgTable(
  "ingredients",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).unique().notNull(),
    image: varchar("image", { length: 255 }),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.name),
  })
);

// Recipe Ingredients (Many-to-Many)
export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    id: serial("id"),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    quantity: text("quantity"),
    isRequired: boolean("is_required").notNull().default(false),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
    };
  }
);

// Preparation steps Table
export const preparationSteps = pgTable(
  "preparation_steps",
  {
    id: serial("id").primaryKey(),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    stepNo: integer("step_no").notNull(),
    stepDescription: text("step_description").notNull(),
  },
  (table) => ({
    recipeIdIndex: index("prep_steps_recipe_idx").on(table.recipeId),
  })
);

// Ingredients used in prepartin step (Many-to-Many)
export const ingredientsUsedInPrepStep = pgTable(
  "ingredients_used_in_prep_step",
  {
    id: serial("id"),
    preparationStepId: integer("preparation_step_id")
      .notNull()
      .references(() => preparationSteps.id, { onDelete: "cascade" }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    quantity: text("quantity"),
    isRequired: boolean("is_required").notNull().default(false),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.preparationStepId, table.ingredientId] }),
    };
  }
);

// Ratings & Reviews
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id"),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.recipeId] }),
    };
  }
);

// Saved Recipes
export const savedRecipes = pgTable(
  "saved_recipes",
  {
    id: serial("id"),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.recipeId] }),
  })
);

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

// Type Exports
export type User = typeof users.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type PreparationStep = typeof preparationSteps.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type SavedRecipe = typeof savedRecipes.$inferSelect;
