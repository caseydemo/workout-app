"use client";

import React from "react";
import { useCardioContext } from "./CardioProvider";

export default function CardioList() {
  const { state } = useCardioContext();

  if (!state.workouts.length) return <p>No workouts found.</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>All Cardio Workouts ({state.workouts.length})</h2>
      {state.workouts.map((workout) => (
        <div key={workout._id} style={{ padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "4px" }}>
          <strong>{workout.activityType}</strong> - {workout.duration} minutes
          {workout.distance && <div>Distance: {workout.distance} miles</div>}
          {workout.caloriesBurned && <div>Calories: {workout.caloriesBurned}</div>}
          {workout.notes && <div>Notes: {workout.notes}</div>}
          <div>Date: {new Date(workout.date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}