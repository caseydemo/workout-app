"use client";

import React, { createContext, useReducer, useContext, useCallback, useMemo } from "react";
import { createNutritionEntry, deleteNutritionEntry, updateNutritionEntry } from "../actions/nutrition";
import { NutritionEntry, NutritionState, NutritionAction } from "./types";

/**
 * PRESENTATION NOTE: Context API + useReducer Pattern
 * ====================================================
 * Why Context API?
 * - Share state across multiple components without prop drilling
 * - Centralize state logic for easier testing and maintenance
 * - Provides a clean separation of concerns
 * 
 * Why useReducer over useState?
 * - Complex state logic with multiple sub-values
 * - State transitions are predictable and testable
 * - Easier to track state changes (similar to Redux pattern)
 * - Next state depends on previous state
 */

// 1. Create the Context with a proper type
type NutritionContextType = {
	state: NutritionState;
	dispatch: React.Dispatch<NutritionAction>;
	addEntry: (entry: Omit<NutritionEntry, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
	updateEntry: (id: string, data: Partial<NutritionEntry>) => Promise<void>;
	removeEntry: (id: string) => Promise<void>;
} | null;

const NutritionContext = createContext<NutritionContextType>(null);

/**
 * PRESENTATION NOTE: Reducer Function
 * ====================================
 * Pure function that takes current state and action, returns new state
 * Benefits:
 * - Predictable state updates
 * - Easy to test (just a function!)
 * - Clear action types make debugging easier
 * - Can log actions for debugging/analytics
 */
function nutritionReducer(state: NutritionState, action: NutritionAction): NutritionState {
	switch (action.type) {
		case "SET_ENTRIES":
			return { ...state, entries: action.payload, error: null };
		
		case "ADD_ENTRY":
			// Add new entry to the beginning of the array
			return { 
				...state, 
				entries: [action.payload, ...state.entries],
				error: null 
			};
		
		case "UPDATE_ENTRY":
			// Replace entry with matching ID
			return {
				...state,
				entries: state.entries.map((entry) =>
					entry._id === action.payload._id ? action.payload : entry
				),
				error: null,
			};
		
		case "REMOVE_ENTRY":
			// Filter out entry with matching ID
			return {
				...state,
				entries: state.entries.filter((entry) => entry._id !== action.payload),
				error: null,
			};
		
		case "SET_LOADING":
			return { ...state, isLoading: action.payload };
		
		case "SET_ERROR":
			return { ...state, error: action.payload, isLoading: false };
		
		default:
			return state;
	}
}

/**
 * PRESENTATION NOTE: Provider Component
 * ======================================
 * Wraps children with context and provides state + actions
 */
export default function NutritionProvider({
	children,
	initialEntries,
}: {
	children: React.ReactNode;
	initialEntries: NutritionEntry[];
}) {
	// Initialize state with useReducer
	const [state, dispatch] = useReducer(nutritionReducer, {
		entries: initialEntries ?? [],
		isLoading: false,
		error: null,
	});

	/**
	 * PRESENTATION NOTE: useCallback Hook
	 * ====================================
	 * Memoizes function references to prevent unnecessary re-renders
	 * Dependency array ensures function is recreated only when dependencies change
	 * Important for performance when passing functions to child components
	 */
	const addEntry = useCallback(
		async (entry: Omit<NutritionEntry, "_id" | "createdAt" | "updatedAt">) => {
			/**
			 * PRESENTATION NOTE: Optimistic Updates
			 * ======================================
			 * Update UI immediately before server confirms
			 * Benefits:
			 * - Feels instant to users (better UX)
			 * - Rollback if server fails
			 * - Reduces perceived latency
			 */
			const tempId = `temp-${Date.now()}`;
			const optimisticEntry = { ...entry, _id: tempId } as NutritionEntry;

			// Add to UI immediately
			dispatch({ type: "ADD_ENTRY", payload: optimisticEntry });
			dispatch({ type: "SET_LOADING", payload: true });

			try {
				// Call server action
				const created = await createNutritionEntry(entry);
				
				// Replace optimistic entry with real data from server
				dispatch({ type: "UPDATE_ENTRY", payload: created });
			} catch (error) {
				// Rollback on failure
				dispatch({ type: "REMOVE_ENTRY", payload: tempId });
				dispatch({ 
					type: "SET_ERROR", 
					payload: error instanceof Error ? error.message : "Failed to create entry" 
				});
				throw error;
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		},
		[]
	);

	const updateEntry = useCallback(
		async (id: string, data: Partial<NutritionEntry>) => {
			// Store original for rollback
			const original = state.entries.find((e) => e._id === id);
			if (!original) return;

			// Optimistic update
			dispatch({ type: "UPDATE_ENTRY", payload: { ...original, ...data } });
			dispatch({ type: "SET_LOADING", payload: true });

			try {
				const updated = await updateNutritionEntry(id, data);
				dispatch({ type: "UPDATE_ENTRY", payload: updated });
			} catch (error) {
				// Rollback to original
				dispatch({ type: "UPDATE_ENTRY", payload: original });
				dispatch({ 
					type: "SET_ERROR", 
					payload: error instanceof Error ? error.message : "Failed to update entry" 
				});
				throw error;
			} finally {
				dispatch({ type: "SET_LOADING", payload: false });
			}
		},
		[state.entries]
	);

	const removeEntry = useCallback(async (id: string) => {
		const original = state.entries.find((e) => e._id === id);
		if (!original) return;

		// Optimistic removal
		dispatch({ type: "REMOVE_ENTRY", payload: id });
		dispatch({ type: "SET_LOADING", payload: true });

		try {
			await deleteNutritionEntry(id);
		} catch (error) {
			// Restore on failure
			dispatch({ type: "ADD_ENTRY", payload: original });
			dispatch({ 
				type: "SET_ERROR", 
				payload: error instanceof Error ? error.message : "Failed to delete entry" 
			});
			throw error;
		} finally {
			dispatch({ type: "SET_LOADING", payload: false });
		}
	}, [state.entries]);

	/**
	 * PRESENTATION NOTE: useMemo Hook
	 * ================================
	 * Memoizes the context value to prevent unnecessary re-renders
	 * Only recreates when dependencies change
	 * Critical for performance with Context API
	 */
	const contextValue = useMemo(
		() => ({
			state,
			dispatch,
			addEntry,
			updateEntry,
			removeEntry,
		}),
		[state, addEntry, updateEntry, removeEntry]
	);

	return (
		<NutritionContext.Provider value={contextValue}>
			{children}
		</NutritionContext.Provider>
	);
}

/**
 * PRESENTATION NOTE: Custom Hook Pattern
 * =======================================
 * Encapsulates context access logic
 * Benefits:
 * - Prevents invalid usage (must be inside provider)
 * - Cleaner component code
 * - Single source of truth for context access
 * - Type-safe access to context
 */
export function useNutrition() {
	const context = useContext(NutritionContext);
	if (!context) {
		throw new Error("useNutrition must be used within NutritionProvider");
	}
	return context;
}
