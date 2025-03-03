import { MagicCard } from "@/components/magicui/magic-card";
import Navbar from "@/components/navbar/navbar";
import RecipeCarousel from "@/components/recipe/recipeCarousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return ( <div>
    <Navbar />
    {/* Hero Section */}
    <RecipeCarousel/>
  </div>
  );
}
