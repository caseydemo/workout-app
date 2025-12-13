"use client";
import React, { createContext, useReducer, useRef, useCallback } from "react";
import { IStrength } from "../models/Strength";

// Workout type is based on imported IStrength model
type Workout = IStrength & { _id?: string };

type State = { workouts: Workout[] };
type Action =
  | { type: "SET"; payload: Workout[] }
  | { type: "ADD"; payload: Workout }
  | { type: "UPDATE"; payload: Workout }
  | { type: "REMOVE"; payload: string };

// create strength context
const StrengthContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addWorkout: (w: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
} | null>(null);

// reducer function to manage state updates
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET":
      return { workouts: action.payload };
    case "ADD":
      return { workouts: [action.payload, ...state.workouts] };
    case "UPDATE":
      return {
        workouts: state.workouts.map((w) => (w._id === action.payload._id ? action.payload : w)),
      };
    case "REMOVE":
      return { workouts: state.workouts.filter((w) => w._id !== action.payload) };
    default:
      return state;
  }
}


export default function StrengthProvider({
	children,
  initialWorkouts,
}: {
	children: React.ReactNode;
  initialWorkouts?: Workout[];
}) {

  // usereducer
  const [state, dispatch] = useReducer(reducer, { workouts: initialWorkouts ?? [] });

  // useRef to track pending optimistic IDs to prevent duplicate requests
  const pending = useRef(new Set<string>());

  // useCallback to define addWorkout function
  // useCallback is used to memoize the function so it doesn't get recreated on every render
  // This is important when passing functions down to child components to prevent unnecessary re-renders
  // what is Omit?
  // Omit is a TypeScript utility type that constructs a type by picking all properties from the given type and then removing some
  const addWorkout = useCallback(async (w: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => {
    // create a temporary id for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...w, _id: tempId } as Workout;
    dispatch({ type: "ADD", payload: optimistic });
    pending.current.add(tempId);
    try {
      // call server action (server-side function exported from app/actions/strength)
      const created = await createStrengthWorkoutAction(w);
      // replace optimistic entry with real data
      dispatch({ type: "UPDATE", payload: created });
      pending.current.delete(tempId);
    } catch (err) {
      // remove optimistic on failure
      dispatch({ type: "REMOVE", payload: tempId });
      pending.current.delete(tempId);
      console.error("Failed to create strength workout", err);
      throw err;
    }
  }, []);

	// Placeholder provider, no state management yet
	return <>{children}</>;
}
