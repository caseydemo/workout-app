"use client";

import React, { useState, useRef } from "react";
import { useStrengthContext } from "./StrengthProvider";
import styles from "./AddWorkout.module.css";

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
            await addWorkout({
                userId: "user123",
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
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Exercise:
                    </label>
                    <select value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} className={styles.select}>
                        <option value="bench press">Bench Press</option>
                        <option value="squat">Squat</option>
                        <option value="deadlift">Deadlift</option>
                        <option value="overhead press">Overhead Press</option>
                        <option value="barbell row">Barbell Row</option>
                        <option value="pull-up">Pull-Up</option>
                        <option value="dip">Dip</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Sets:
                    </label>
                    <input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Reps per Set:
                    </label>
                    <input type="number" value={repsPerSet} onChange={(e) => setRepsPerSet(Number(e.target.value))} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Weight (lbs):
                    </label>
                    <input type="number" step="0.1" value={weight || ""} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Notes:
                    </label>
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.input} />
                </div>
            </div>
            <button type="submit" className={styles.submitButton} disabled={submitting.current}>
                {submitting.current ? "Adding..." : "Add Workout"}
            </button>
        </form>        
    );
}