"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [index]);

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length);
  };

  // Get the 3 cards to show
  const visibleRecipes = [
    recipes[index % recipes.length],
    recipes[(index + 1) % recipes.length],
    recipes[(index + 2) % recipes.length],
  ];

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
          {visibleRecipes.map((recipe) => (
            <Card key={recipe.id} className="w-[200px] md:w-[250px] shadow-lg">
              {/* <img
                src={recipe.image}
                alt={recipe.title}
                className="h-40 w-full object-cover rounded-t-lg"
              /> */}
              <CardHeader>
                <CardTitle className="text-lg text-center">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline">View Recipe</Button>
              </CardContent>
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
