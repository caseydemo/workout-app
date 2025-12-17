"use client";

import React, { useState, useRef } from "react";
import { useCardioContext } from "./CardioProvider";
import styles from "./AddWorkout.module.css";

export default function AddWorkout() {
  const { addWorkout } = useCardioContext();
  const [activityType, setActivityType] = useState("running");
  const [duration, setDuration] = useState(30);
  const [distance, setDistance] = useState<number | undefined>();
  const [caloriesBurned, setCaloriesBurned] = useState<number | undefined>();
  const [notes, setNotes] = useState("");
  const submitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    try {
      await addWorkout({
        userId: "user123", // TODO: get from auth
        activityType,
        duration,
        distance,
        caloriesBurned,
        notes,
        date: new Date(),
      });
      setNotes("");
      setDistance(undefined);
      setCaloriesBurned(undefined);
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
            Activity:
          </label>
          <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className={styles.select}>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="swimming">Swimming</option>
            <option value="walking">Walking</option>
            <option value="rowing">Rowing</option>
            <option value="elliptical">Elliptical</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Duration (min):
          </label>
          <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Distance (miles):
          </label>
          <input type="number" step="0.1" value={distance || ""} onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : undefined)} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Calories:
          </label>
          <input type="number" value={caloriesBurned || ""} onChange={(e) => setCaloriesBurned(e.target.value ? Number(e.target.value) : undefined)} className={styles.input} />
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