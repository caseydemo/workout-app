"use client";

import React, { useMemo } from "react";
import { useNutrition } from "./NutritionProvider";
import NutritionCard from "./NutritionCard";

/**
 * PRESENTATION NOTE: useMemo for Derived State
 * =============================================
 * Computing statistics from entries only when entries change
 * Prevents expensive calculations on every render
 */

export default function NutritionList() {
	const { state } = useNutrition();

	// Compute statistics with useMemo - only recalculates when entries change
	const stats = useMemo(() => {
		const totalCalories = state.entries.reduce((sum, entry) => sum + entry.calories, 0);
		const totalProtein = state.entries.reduce((sum, entry) => sum + (entry.protein || 0), 0);
		const totalCarbs = state.entries.reduce((sum, entry) => sum + (entry.carbs || 0), 0);
		const totalFats = state.entries.reduce((sum, entry) => sum + (entry.fats || 0), 0);
		
		return {
			count: state.entries.length,
			totalCalories: Math.round(totalCalories),
			totalProtein: Math.round(totalProtein),
			totalCarbs: Math.round(totalCarbs),
			totalFats: Math.round(totalFats),
		};
	}, [state.entries]);

	if (state.entries.length === 0) {
		return (
			<div style={{ 
				padding: "40px", 
				textAlign: "center", 
				color: "#666",
				border: "2px dashed #ddd",
				borderRadius: "8px"
			}}>
				<p>No nutrition entries yet. Add your first meal above!</p>
			</div>
		);
	}

	return (
		<div>
			{/* Statistics Panel */}
			<div style={{ 
				display: "grid", 
				gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
				gap: "15px",
				marginBottom: "30px"
			}}>
				<StatCard label="Total Entries" value={stats.count} />
				<StatCard label="Total Calories" value={`${stats.totalCalories} kcal`} />
				<StatCard label="Total Protein" value={`${stats.totalProtein}g`} />
				<StatCard label="Total Carbs" value={`${stats.totalCarbs}g`} />
				<StatCard label="Total Fats" value={`${stats.totalFats}g`} />
			</div>

			{/* Entries List */}
			<h2>Your Nutrition Entries ({state.entries.length})</h2>
			<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
				{state.entries.map((entry) => (
					<NutritionCard key={entry._id} entry={entry} />
				))}
			</div>
		</div>
	);
}

/**
 * PRESENTATION NOTE: React.memo
 * ==============================
 * Prevents re-rendering if props haven't changed
 * Critical for lists with many items
 */
const StatCard = React.memo(({ label, value }: { label: string; value: string | number }) => (
	<div style={{
		padding: "20px",
		backgroundColor: "#f0f7ff",
		borderRadius: "8px",
		border: "1px solid #b3d9ff",
		textAlign: "center"
	}}>
		<div style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>
			{value}
		</div>
		<div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
			{label}
		</div>
	</div>
));

StatCard.displayName = "StatCard";
