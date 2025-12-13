"use client";

import React, { createContext, useReducer, useContext, useRef, useCallback } from "react";
import { createCardioWorkout as createCardioWorkoutAction } from "../actions/cardio";
import { ICardio } from "../models/Cardio";

type Workout = ICardio & { _id?: string };

type State = { workouts: Workout[] };
type Action =
  | { type: "SET"; payload: Workout[] }
  | { type: "ADD"; payload: Workout }
  | { type: "UPDATE"; payload: Workout }
  | { type: "REMOVE"; payload: string };

const CardioContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addWorkout: (w: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
} | null>(null);

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

export default function CardioProvider({ children, initialWorkouts }: { children: React.ReactNode; initialWorkouts: Workout[] }) {
  const [state, dispatch] = useReducer(reducer, { workouts: initialWorkouts ?? [] });

  // useRef to track pending optimistic IDs to prevent duplicate requests
  const pending = useRef(new Set<string>());

  const addWorkout = useCallback(async (w: Omit<Workout, '_id' | 'createdAt' | 'updatedAt'>) => {
    // create a temporary id for optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...w, _id: tempId } as Workout;
    dispatch({ type: "ADD", payload: optimistic });
    pending.current.add(tempId);

    try {
      // call server action (server-side function exported from app/actions/cardio)
      const created = await createCardioWorkoutAction(w);
      // replace optimistic entry with real data
      dispatch({ type: "UPDATE", payload: created });
      pending.current.delete(tempId);
    } catch (err) {
      // remove optimistic on failure
      dispatch({ type: "REMOVE", payload: tempId });
      pending.current.delete(tempId);
      console.error("Failed to create cardio workout", err);
      throw err;
    }
  }, []);

  return (
    <CardioContext.Provider value={{ state, dispatch, addWorkout }}>
      {children}
    </CardioContext.Provider>
  );
}

export function useCardioContext() {
  const ctx = useContext(CardioContext);
  if (!ctx) throw new Error("useCardioContext must be used inside CardioProvider");
  return ctx;
}