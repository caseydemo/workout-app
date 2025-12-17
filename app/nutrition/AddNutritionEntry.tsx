"use client";

import React, { useState, FormEvent } from "react";
import { useNutrition } from "./NutritionProvider";
import { NutritionEntry } from "./types";

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
		<div style={{ 
			marginBottom: "30px", 
			padding: "20px", 
			border: "1px solid #ddd", 
			borderRadius: "8px",
			backgroundColor: "#f9f9f9",
            color: "black"
		}}>
			<h2>Add Nutrition Entry</h2>
			{state.error && (
				<div style={{ 
					color: "red", 
					padding: "10px", 
					marginBottom: "10px", 
					backgroundColor: "#ffebee",
					borderRadius: "4px"
				}}>
					{state.error}
				</div>
			)}
			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: "15px" }}>
					<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
						Meal Type:
					</label>
					<select
						value={mealType}
						onChange={(e) => setMealType(e.target.value as any)}
						style={{ 
							width: "100%", 
							padding: "8px", 
							borderRadius: "4px", 
							border: "1px solid #ccc" 
						}}
					>
						<option value="breakfast">Breakfast</option>
						<option value="lunch">Lunch</option>
						<option value="dinner">Dinner</option>
						<option value="snack">Snack</option>
					</select>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
						Food Items (comma-separated):
					</label>
					<input
						type="text"
						value={foodItems}
						onChange={(e) => setFoodItems(e.target.value)}
						placeholder="e.g., Chicken breast, Brown rice, Broccoli"
						style={{ 
							width: "100%", 
							padding: "8px", 
							borderRadius: "4px", 
							border: "1px solid #ccc" 
						}}
						required
					/>
				</div>

				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "15px" }}>
					<div>
						<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
							Calories*:
						</label>
						<input
							type="number"
							value={calories}
							onChange={(e) => setCalories(e.target.value)}
							placeholder="500"
							style={{ 
								width: "100%", 
								padding: "8px", 
								borderRadius: "4px", 
								border: "1px solid #ccc" 
							}}
							required
						/>
					</div>
					<div>
						<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
							Protein (g):
						</label>
						<input
							type="number"
							value={protein}
							onChange={(e) => setProtein(e.target.value)}
							placeholder="30"
							style={{ 
								width: "100%", 
								padding: "8px", 
								borderRadius: "4px", 
								border: "1px solid #ccc" 
							}}
						/>
					</div>
					<div>
						<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
							Carbs (g):
						</label>
						<input
							type="number"
							value={carbs}
							onChange={(e) => setCarbs(e.target.value)}
							placeholder="45"
							style={{ 
								width: "100%", 
								padding: "8px", 
								borderRadius: "4px", 
								border: "1px solid #ccc" 
							}}
						/>
					</div>
					<div>
						<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
							Fats (g):
						</label>
						<input
							type="number"
							value={fats}
							onChange={(e) => setFats(e.target.value)}
							placeholder="15"
							style={{ 
								width: "100%", 
								padding: "8px", 
								borderRadius: "4px", 
								border: "1px solid #ccc" 
							}}
						/>
					</div>
				</div>

				<div style={{ marginBottom: "15px" }}>
					<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
						Notes:
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Any additional notes..."
						rows={3}
						style={{ 
							width: "100%", 
							padding: "8px", 
							borderRadius: "4px", 
							border: "1px solid #ccc",
							resize: "vertical"
						}}
					/>
				</div>

				<button
					type="submit"
					disabled={state.isLoading}
					style={{
						padding: "10px 20px",
						backgroundColor: state.isLoading ? "#ccc" : "#4CAF50",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: state.isLoading ? "not-allowed" : "pointer",
						fontWeight: "bold",
					}}
				>
					{state.isLoading ? "Adding..." : "Add Entry"}
				</button>
			</form>
		</div>
	);
}
