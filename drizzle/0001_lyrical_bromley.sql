ALTER TABLE "ingredients_used_in_prep_step" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD COLUMN "id" serial NOT NULL;