"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RecipeDetails from "./recipeDetails";

type Recipe = {
  id: string;
  title: string;
  description?: string;
  recipeIngredients?: { ingredient: { name: string } }[];
  averageRating?: number;
};

const SearchedRecipesList = ({ recipes }: { recipes: Recipe[] }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(recipes.length / pageSize);
  const paginatedRecipes = recipes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Show full recipe when selected */}
      {selectedRecipe ? (
        <div>
          <Button variant="outline" className="mb-4" onClick={() => setSelectedRecipe(null)}>
            Back to Results
          </Button>
          <RecipeDetails recipe={selectedRecipe} />
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">Search Results</h2>

          {paginatedRecipes.length === 0 ? (
            <p className="text-center text-gray-500">No recipes found.</p>
          ) : (
            <div className="space-y-4">
              {paginatedRecipes.map((recipe) => (
                <Card key={recipe.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600">{recipe.description}</p>

                    {/* Ingredients Preview */}
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Ingredients:</strong>{" "}
                      {recipe.recipeIngredients?.map((ing) => ing.ingredient.name).join(", ")}
                    </p>

                    {/* Rating */}
                    <div className="mt-2 flex items-center justify-between">
                      <Badge variant="outline">
                        ⭐ {recipe.averageRating ? recipe.averageRating.toFixed(1) : "N/A"}
                      </Badge>

                      {/* View Recipe Button */}
                      <Button size="sm" onClick={() => setSelectedRecipe(recipe)}>
                        View Recipe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchedRecipesList;
