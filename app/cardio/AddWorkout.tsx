"use client";

import React, { useState, useRef } from "react";
import { useCardioContext } from "./CardioProvider";

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
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <label>
        Activity:
        <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
          <option value="walking">Walking</option>
          <option value="rowing">Rowing</option>
          <option value="elliptical">Elliptical</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label style={{ marginLeft: 8 }}>
        Duration (min):
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} required />
      </label>
      <label style={{ marginLeft: 8 }}>
        Distance (miles):
        <input type="number" step="0.1" value={distance || ""} onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : undefined)} />
      </label>
      <label style={{ marginLeft: 8 }}>
        Calories:
        <input type="number" value={caloriesBurned || ""} onChange={(e) => setCaloriesBurned(e.target.value ? Number(e.target.value) : undefined)} />
      </label>
      <label style={{ marginLeft: 8 }}>
        Notes:
        <input value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <button type="submit" style={{ marginLeft: 8 }}>Add Workout</button>
    </form>
  );
}