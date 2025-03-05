import { MagicCard } from "@/components/magicui/magic-card";
import Navbar from "@/components/navbar/navbar";
import RecipeCarousel from "@/components/recipe/recipeCarousel";
import SavedRecipesList from "@/components/recipe/savedRecipesList";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  
  return ( <div>
    <Navbar />
    {/* Hero Section */}
    <RecipeCarousel/>
    <SavedRecipesList/>
  </div>
  );
}
