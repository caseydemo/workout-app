"use client";

import React, { useState, FormEvent } from "react";
import { useNutrition } from "./NutritionProvider";
import { NutritionEntry } from "./types";
import styles from "./AddNutritionEntry.module.css";

/**
 * PRESENTATION NOTE: Form Component with Controlled Inputs
 * =========================================================
 * Demonstrates:
 * - Controlled components pattern
 * - Form state management
 * - Event handling
 * - Integration with Context API
 */

export default function AddNutritionEntry() {
	const { addEntry, state } = useNutrition();

	// Form state - each input is controlled by React
	const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
	const [foodItems, setFoodItems] = useState<string>("");
	const [calories, setCalories] = useState<string>("");
	const [protein, setProtein] = useState<string>("");
	const [carbs, setCarbs] = useState<string>("");
	const [fats, setFats] = useState<string>("");
	const [notes, setNotes] = useState<string>("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		// Validation
		if (!foodItems.trim() || !calories) {
			alert("Please enter food items and calories");
			return;
		}

		try {
			await addEntry({
				userId: "user123", // In real app, get from auth
				mealType,
				foodItems: foodItems.split(",").map((item) => item.trim()),
				calories: parseFloat(calories),
				protein: protein ? parseFloat(protein) : undefined,
				carbs: carbs ? parseFloat(carbs) : undefined,
				fats: fats ? parseFloat(fats) : undefined,
				notes: notes || undefined,
				date: new Date(),
			});

			// Reset form
			setFoodItems("");
			setCalories("");
			setProtein("");
			setCarbs("");
			setFats("");
			setNotes("");
		} catch (error) {
			console.error("Failed to add nutrition entry:", error);
		}
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Add Nutrition Entry</h2>
			{state.error && (
				<div className={styles.error}>
					{state.error}
				</div>
			)}
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.formGroup}>
					<label className={styles.label}>
						Meal Type:
					</label>
					<select
						value={mealType}
						onChange={(e) => setMealType(e.target.value as any)}
						className={styles.select}
					>
						<option value="breakfast">Breakfast</option>
						<option value="lunch">Lunch</option>
						<option value="dinner">Dinner</option>
						<option value="snack">Snack</option>
					</select>
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Food Items (comma-separated):
					</label>
					<input
						type="text"
						value={foodItems}
						onChange={(e) => setFoodItems(e.target.value)}
						placeholder="e.g., Chicken breast, Brown rice, Broccoli"
						className={styles.input}
						required
					/>
				</div>

				<div className={styles.formRow}>
					<div className={styles.formGroup}>
						<label className={styles.label}>
							Calories*:
						</label>
						<input
							type="number"
							value={calories}
							onChange={(e) => setCalories(e.target.value)}
							placeholder="500"
							className={styles.input}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>
							Protein (g):
						</label>
						<input
							type="number"
							value={protein}
							onChange={(e) => setProtein(e.target.value)}
							placeholder="30"
							className={styles.input}
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>
							Carbs (g):
						</label>
						<input
							type="number"
							value={carbs}
							onChange={(e) => setCarbs(e.target.value)}
							placeholder="45"
							className={styles.input}
						/>
					</div>
					<div className={styles.formGroup}>
						<label className={styles.label}>
							Fats (g):
						</label>
						<input
							type="number"
							value={fats}
							onChange={(e) => setFats(e.target.value)}
							placeholder="15"
							className={styles.input}
						/>
					</div>
				</div>

				<div className={styles.formGroup}>
					<label className={styles.label}>
						Notes:
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Any additional notes..."
						className={styles.textarea}
					/>
				</div>

				<button
					type="submit"
					disabled={state.isLoading}
					className={styles.submitButton}
				>
					{state.isLoading ? "Adding..." : "Add Entry"}
				</button>
			</form>
		</div>
	);
}
