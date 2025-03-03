"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const ingredientSuggestions = ["Tomato", "Onion", "Garlic", "Chicken", "Pepper", "Cheese", "Basil"];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(ingredientSuggestions);

  // Handle ingredient input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setFilteredSuggestions(
      ingredientSuggestions.filter((ing) => ing.toLowerCase().includes(value.toLowerCase()))
    );
  };

  // Add ingredient to array
  const addIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
    setInput("");
  };

  // Remove ingredient
  const removeIngredient = (ingredient: string) => {
    console.log("removing ingredient:", ingredient);
    
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };
  console.log("Ingredients:", ingredients);

  // Handle search
  const handleSearch = () => {
    console.log("Searching for:", { title, ingredients });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Search Recipes</DialogTitle>
        </DialogHeader>

        {/* Recipe Title Input */}
        <Input
          placeholder="Enter recipe title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Ingredient Input */}
        <div className="relative">
          <Input
            placeholder="Add ingredients..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && addIngredient(input)}
          />
          
          {/* Ingredient Suggestions Dropdown */}
          {input && filteredSuggestions.length > 0 && (
            <ScrollArea className="absolute left-0 right-0 top-10 bg-white border rounded-md shadow-md z-10">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => addIngredient(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        {/* Display Selected Ingredients */}
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <Badge key={ingredient} className="flex items-center gap-1">
              {ingredient}
              <X size={12} className="cursor-pointer" onClick={() => removeIngredient(ingredient)} />
            </Badge>
          ))}
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full">
          Search
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
