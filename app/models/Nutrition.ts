import mongoose, { Schema, Model, Document } from "mongoose";

// TypeScript interface for type safety
export interface INutrition {
	userId: string;
	mealType: "breakfast" | "lunch" | "dinner" | "snack";
	foodItems: string[];
	calories: number;
	protein?: number; // in grams
	carbs?: number; // in grams
	fats?: number; // in grams
	notes?: string;
	date: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

// Mongoose document interface
export interface INutritionDocument extends INutrition, Document {}

// Define the schema
const NutritionSchema = new Schema<INutritionDocument>(
	{
		userId: {
			type: String,
			required: [true, "User ID is required"],
			index: true,
		},
		mealType: {
			type: String,
			required: [true, "Meal type is required"],
			enum: ["breakfast", "lunch", "dinner", "snack"],
			lowercase: true,
		},
		foodItems: {
			type: [String],
			required: [true, "At least one food item is required"],
			validate: {
				validator: (v: string[]) => v && v.length > 0,
				message: "Food items cannot be empty",
			},
		},
		calories: {
			type: Number,
			required: [true, "Calories are required"],
			min: [0, "Calories cannot be negative"],
		},
		protein: {
			type: Number,
			min: [0, "Protein cannot be negative"],
		},
		carbs: {
			type: Number,
			min: [0, "Carbs cannot be negative"],
		},
		fats: {
			type: Number,
			min: [0, "Fats cannot be negative"],
		},
		notes: {
			type: String,
			maxlength: [500, "Notes cannot exceed 500 characters"],
			trim: true,
		},
		date: {
			type: Date,
			required: [true, "Date is required"],
			default: Date.now,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

// Compound index for efficient queries
NutritionSchema.index({ userId: 1, date: -1 });

// Prevent model recompilation in Next.js development
const Nutrition: Model<INutritionDocument> =
	mongoose.models.Nutrition ||
	mongoose.model<INutritionDocument>("Nutrition", NutritionSchema);

export default Nutrition;
