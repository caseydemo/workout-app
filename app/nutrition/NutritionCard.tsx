"use client";

import React, { useState } from "react";
import { useNutrition } from "./NutritionProvider";
import { NutritionEntry } from "./types";
import styles from "./NutritionCard.module.css";

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
		<div className={`${styles.card} ${isDeleting ? styles.cardDeleting : ''}`}>
			<div className={styles.cardHeader}>
				<div className={styles.cardContent}>
					<div className={styles.mealHeader}>
						<span className={styles.emoji}>{getMealEmoji(entry.mealType)}</span>
						<h3 className={styles.mealType}>{entry.mealType}</h3>
						<span className={styles.date}>
							{formatDate(entry.date)}
						</span>
					</div>

					<div className={styles.foodItems}>
						<strong>Food Items:</strong>{" "}
						{entry.foodItems.join(", ")}
					</div>

					<div className={styles.macrosGrid}>
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
						<div className={styles.notes}>
							<strong>Notes:</strong> {entry.notes}
						</div>
					)}
				</div>

				<button
					onClick={handleDelete}
					disabled={isDeleting}
					className={styles.deleteButton}
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
		<div className={styles.macroItem} style={{ backgroundColor: `${color}15`, color }}>
			<div className={styles.macroValue}>
				{value}{unit}
			</div>
			<div className={styles.macroLabel}>{label}</div>
		</div>
	);
}
