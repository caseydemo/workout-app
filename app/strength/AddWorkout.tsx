"use client";

import React, { useState, useRef } from "react";
import { useStrengthContext } from "./StrengthProvider";

export default function AddWorkout() {

    const { addWorkout } = useStrengthContext();
    const [exerciseName, setExerciseName] = useState("bench press");
    const [sets, setSets] = useState(3);
    const [repsPerSet, setRepsPerSet] = useState(10);
    const [weight, setWeight] = useState<number | undefined>();
    const [notes, setNotes] = useState("");
    const submitting = useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("payload:", {
            exerciseName,
            sets,
            repsPerSet,
            weight,
            notes,
        });
        e.preventDefault();
        if (submitting.current) return;
        submitting.current = true;
        try {
            // 
            await addWorkout({
                userId: "user123", //
                exerciseName,
                sets,                
                repsPerSet,
                weight,
                notes,
                date: new Date(),
            });
            setNotes("");
            setWeight(undefined);
        } catch (err) {
            console.error(err);
        } finally {
            submitting.current = false;
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <label>
                Exercise:
                <select value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}>
                    <option value="bench press">Bench Press</option>
                    <option value="squat">Squat</option>
                    <option value="deadlift">Deadlift</option>
                    <option value="overhead press">Overhead Press</option>
                    <option value="barbell row">Barbell Row</option>
                    <option value="pull-up">Pull-Up</option>
                    <option value="dip">Dip</option>
                    <option value="other">Other</option>
                </select>
            </label>
            <label style={{ marginLeft: 8 }}>
                Sets:
                <input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} required />
            </label>
            <label style={{ marginLeft: 8 }}>
                Reps per Set:
                <input type="number" value={repsPerSet} onChange={(e) => setRepsPerSet(Number(e.target.value))} required />
            </label>
            <label style={{ marginLeft: 8 }}>
                Weight (lbs):
                <input type="number" step="0.1" value={weight || ""} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} />
            </label>
            <label style={{ marginLeft: 8 }}>
                Notes:
                <input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button type="submit" style={{ marginLeft: 8 }}>Add Workout</button>
        </form>        
    );
}