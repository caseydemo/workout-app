"use client";

import React, { useState } from "react";
import { useNutrition } from "./NutritionProvider";
import { NutritionEntry } from "./types";

/**
 * PRESENTATION NOTE: React.memo with Comparison Function
 * =======================================================
 * Optimizes re-renders by only updating when entry actually changes
 * Custom comparison function for fine-grained control
 */

interface NutritionCardProps {
	entry: NutritionEntry;
}

function NutritionCard({ entry }: NutritionCardProps) {
	const { removeEntry } = useNutrition();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		if (!entry._id) return;
		if (!confirm("Are you sure you want to delete this entry?")) return;

		setIsDeleting(true);
		try {
			await removeEntry(entry._id);
		} catch (error) {
			console.error("Failed to delete:", error);
			setIsDeleting(false);
		}
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getMealEmoji = (mealType: string) => {
		const emojis = {
			breakfast: "🍳",
			lunch: "🥗",
			dinner: "🍽️",
			snack: "🍎",
		};
		return emojis[mealType as keyof typeof emojis] || "🍴";
	};

	return (
		<div
			style={{
				padding: "20px",
				border: "1px solid #ddd",
				borderRadius: "8px",
				backgroundColor: isDeleting ? "#f5f5f5" : "white",
				opacity: isDeleting ? 0.6 : 1,
				transition: "all 0.3s ease",
                color: "black"
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
				<div style={{ flex: 1 }}>
					<div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
						<span style={{ fontSize: "24px" }}>{getMealEmoji(entry.mealType)}</span>
						<h3 style={{ margin: 0, textTransform: "capitalize" }}>{entry.mealType}</h3>
						<span style={{ color: "#666", fontSize: "14px" }}>
							{formatDate(entry.date)}
						</span>
					</div>

					<div style={{ marginBottom: "10px" }}>
						<strong>Food Items:</strong>{" "}
						{entry.foodItems.join(", ")}
					</div>

					<div style={{ 
						display: "grid", 
						gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
						gap: "10px",
						marginBottom: "10px"
					}}>
						<MacroDisplay label="Calories" value={entry.calories} unit="kcal" color="#ff6b6b" />
						{entry.protein !== undefined && (
							<MacroDisplay label="Protein" value={entry.protein} unit="g" color="#4CAF50" />
						)}
						{entry.carbs !== undefined && (
							<MacroDisplay label="Carbs" value={entry.carbs} unit="g" color="#2196F3" />
						)}
						{entry.fats !== undefined && (
							<MacroDisplay label="Fats" value={entry.fats} unit="g" color="#FF9800" />
						)}
					</div>

					{entry.notes && (
						<div style={{ 
							marginTop: "10px", 
							padding: "10px", 
							backgroundColor: "#f9f9f9",
							borderRadius: "4px",
							fontSize: "14px",
							fontStyle: "italic"
						}}>
							<strong>Notes:</strong> {entry.notes}
						</div>
					)}
				</div>

				<button
					onClick={handleDelete}
					disabled={isDeleting}
					style={{
						padding: "8px 16px",
						backgroundColor: isDeleting ? "#ccc" : "#f44336",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: isDeleting ? "not-allowed" : "pointer",
						marginLeft: "20px",
					}}
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</button>
			</div>
		</div>
	);
}

/**
 * PRESENTATION NOTE: Memoized Component with Custom Comparison
 * =============================================================
 * Only re-renders if entry._id changes
 * Prevents unnecessary renders when parent updates
 */
export default React.memo(NutritionCard, (prevProps, nextProps) => {
	// Return true if props are equal (skip re-render)
	// Return false if props are different (do re-render)
	return prevProps.entry._id === nextProps.entry._id;
});

// Small component for displaying macros
function MacroDisplay({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
	return (
		<div style={{ textAlign: "center" }}>
			<div style={{ fontSize: "18px", fontWeight: "bold", color }}>
				{value}{unit}
			</div>
			<div style={{ fontSize: "12px", color: "#666" }}>{label}</div>
		</div>
	);
}
