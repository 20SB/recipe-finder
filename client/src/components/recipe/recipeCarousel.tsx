"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecipe } from "@/providers/RecipeContext";

const recipes = [
  { id: 1, title: "Spaghetti Carbonara", image: "/images/spaghetti.jpg" },
  { id: 2, title: "Grilled Chicken", image: "/images/chicken.jpg" },
  { id: 3, title: "Vegan Salad", image: "/images/salad.jpg" },
  { id: 4, title: "Sushi Rolls", image: "/images/sushi.jpg" },
  { id: 5, title: "Pancakes", image: "/images/pancakes.jpg" },
  { id: 6, title: "Tacos", image: "/images/tacos.jpg" },
];

const RecipeCarousel = () => {
  const [index, setIndex] = useState(0);
  const { loading, bestRecipes } = useRecipe();
  // console.log("loading---", loading);
  // console.log("bestRecipes---", bestRecipes);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  if (loading ) {
    return <div>Loading...</div>;
  }

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length);
  };

  // Get the 3 cards to show
  const visibleRecipes = [recipes[index % recipes.length], recipes[(index + 1) % recipes.length], recipes[(index + 2) % recipes.length]];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Best Recipes to Try</h2>

      {/* Carousel Container */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <Button variant="outline" size="icon" onClick={prevSlide} className="hidden md:flex">
          <ChevronLeft />
        </Button>

        {/* Recipe Cards */}
        <div className="flex gap-4 overflow-hidden">
          {bestRecipes?.map((recipe: any) => (
            <Card key={recipe.id} className="w-[250px] md:w-[300px] shadow-lg rounded-lg bg-white">
              {/* Recipe Image */}
              {/* <img src={recipe.imageUrl} alt={recipe.title} className="h-40 w-full object-cover rounded-t-lg" /> */}

              {/* Card Header */}
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-center text-gray-900">{recipe.title}</CardTitle>
              </CardHeader>

              {/* Card Body Content */}
              <CardContent className="p-4 space-y-2">
                <p className="text-sm text-gray-600">Cuisine: {recipe.cuisineType}</p>
                <p className="text-sm text-gray-600">Prep Time: {recipe.preparationTime} mins</p>
                <p className="text-sm text-gray-600">Difficulty: {recipe.difficultyLevel}</p>
                <p className="text-sm text-gray-600">Calories: {recipe.calorieCount} kcal</p>
                <p className="text-sm text-gray-600">Rating: {recipe.averageRating}</p>
                <p className="text-sm text-gray-600">{recipe.description}</p>

                {/* Ingredients List */}
                <div className="space-y-1">
                  {recipe?.recipeIngredients?.map((ingredientData: any, index: any) => (
                    <div key={index} className="flex items-center space-x-2">
                      {/* <img src={ingredientData.ingredient.image} alt={ingredientData?.ingredient?.name} className="w-6 h-6 rounded-full" /> */}
                      <span className="text-sm text-gray-800">
                        {ingredientData.quantity} {ingredientData.ingredient.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Button for viewing the recipe */}
              <CardFooter className="p-4">
                <Button variant="outline" className="w-full text-sm text-blue-600">
                  View Recipe
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Next Button */}
        <Button variant="outline" size="icon" onClick={nextSlide} className="hidden md:flex">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default RecipeCarousel;
