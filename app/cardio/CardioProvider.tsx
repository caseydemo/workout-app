"use client";
import React, { createContext, useReducer, useContext, useRef, useCallback } from "react";
import { createCardioWorkout as createCardioWorkoutAction } from "../actions/cardio";
import { CardioWorkoutType } from "./types";

export default function CardioProvider({ children }: { children: React.ReactNode }) {
    console.log('this is the cardio provider and should be front farts ');
    
    return (
        <div>
            this is inside the cardio provider and shoould be front end
            {children}
        </div>
    );
}