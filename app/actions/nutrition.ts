"use server";
import connectDB from "../lib/db";
import Nutrition, { INutrition } from "../models/Nutrition";

/**
 * PRESENTATION NOTE: Server Actions
 * ===================================
 * Next.js Server Actions allow us to define server-side functions
 * that can be called directly from client components.
 * Benefits:
 * - Type-safe API calls without manual fetch/axios
 * - Automatic serialization/deserialization
 * - Built-in error handling
 * - No need for separate API routes
 */

export const createNutritionEntry = async (data: INutrition) => {
	console.log("Server action: Creating nutrition entry", data);
	try {
		await connectDB();
		const newEntry = new Nutrition({ ...data });
		await newEntry.save();
		console.log("Nutrition entry saved:", newEntry._id);
		
		// IMPORTANT: Return plain objects, not Mongoose documents
		// Next.js can't serialize class instances across server/client boundary
		return JSON.parse(JSON.stringify(newEntry));
	} catch (error) {
		console.error("Error in createNutritionEntry:", error);
		throw error;
	}
};

export const getNutritionEntries = async (id?: string) => {
	try {
		await connectDB();
		if (id) {
			const entry = await Nutrition.findById(id).exec();
			return JSON.parse(JSON.stringify(entry));
		}
		const entries = await Nutrition.find().sort({ date: -1 }).exec();
		return JSON.parse(JSON.stringify(entries));
	} catch (error) {
		console.error("Error in getNutritionEntries:", error);
		throw error;
	}
};

export const updateNutritionEntry = async (id: string, data: Partial<INutrition>) => {
	try {
		await connectDB();
		const updated = await Nutrition.findByIdAndUpdate(
			id,
			{ ...data },
			{ new: true, runValidators: true }
		).exec();
		return JSON.parse(JSON.stringify(updated));
	} catch (error) {
		console.error("Error in updateNutritionEntry:", error);
		throw error;
	}
};

export const deleteNutritionEntry = async (id: string) => {
	try {
		await connectDB();
		const deleted = await Nutrition.findByIdAndDelete(id).exec();
		return JSON.parse(JSON.stringify(deleted));
	} catch (error) {
		console.error("Error in deleteNutritionEntry:", error);
		throw error;
	}
};
