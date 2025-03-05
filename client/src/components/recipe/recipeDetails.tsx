"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

type Recipe = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cuisineType?: string;
  preparationTime?: number;
  difficultyLevel?: string;
  calorieCount?: number;
  createdBy?: {
    name: string;
    avatar?: string;
  };
  recipeIngredients?: { ingredient: { name: string } }[];
  preparationSteps?: { stepNo: number; stepDescription: string }[];
};

const RecipeDetails = ({ recipe }: { recipe: any }) => {
  const [isFavorite, setIsFavorite] = useState(recipe?.isSaved||false);
  console.log("rec---", recipe)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="w-[350px] shadow-lg rounded-lg overflow-hidden">
      {/* Recipe Image */}
      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 object-cover" />
      )}

      {/* Recipe Header */}
      <CardHeader>
        <CardTitle className="text-xl">{recipe.title}</CardTitle>

        <div className="flex justify-between items-center mt-2">
          {recipe.cuisineType && <Badge>{recipe.cuisineType}</Badge>}
          {recipe.difficultyLevel && <Badge variant="outline">{recipe.difficultyLevel}</Badge>}
        </div>
      </CardHeader>

      {/* Recipe Details */}
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-500">{recipe.description}</p>

        {/* Meta Info */}
        <div className="flex justify-between text-sm text-gray-600">
          {recipe.preparationTime && <span>🕒 {recipe.preparationTime} mins</span>}
          {recipe.calorieCount && <span>🔥 {recipe.calorieCount} kcal</span>}
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-sm">Ingredients:</h3>
          <ul className="list-disc ml-4 text-sm">
            {recipe.recipeIngredients?.map((ing:any, index:any) => (
              <li key={index}>{ing.ingredient.name}</li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        {recipe.preparationSteps && (
          <details className="mt-2">
            <summary className="text-blue-500 cursor-pointer">View Steps</summary>
            <ul className="mt-2 list-decimal ml-4 text-sm">
              {recipe.preparationSteps.map((step:any) => (
                <li key={step.stepNo}>{step.stepDescription}</li>
              ))}
            </ul>
          </details>
        )}

        {/* Created By */}
        {recipe.createdBy && (
          <div className="flex items-center mt-2">
            <Avatar>
              <AvatarImage src={recipe.createdBy.avatar} alt={recipe.createdBy.name} />
              <AvatarFallback>{recipe.createdBy.name[0]}</AvatarFallback>
            </Avatar>
            <span className="ml-2 text-sm text-gray-600">By {recipe.createdBy.name}</span>
          </div>
        )}

        {/* Favorite Button */}
        <Button variant="outline" className="w-full mt-3 flex items-center gap-2" onClick={toggleFavorite}>
          <Heart className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} />
          {isFavorite ? "Favorited" : "Add to Favorites"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecipeDetails;
