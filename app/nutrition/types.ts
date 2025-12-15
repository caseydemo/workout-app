/**
 * PRESENTATION NOTE: TypeScript Types
 * ====================================
 * Centralizing types improves maintainability and reusability
 */

import { INutrition } from "../models/Nutrition";

export type NutritionEntry = INutrition & { _id?: string };

export type NutritionState = {
	entries: NutritionEntry[];
	isLoading: boolean;
	error: string | null;
};

export type NutritionAction =
	| { type: "SET_ENTRIES"; payload: NutritionEntry[] }
	| { type: "ADD_ENTRY"; payload: NutritionEntry }
	| { type: "UPDATE_ENTRY"; payload: NutritionEntry }
	| { type: "REMOVE_ENTRY"; payload: string }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: string | null };
