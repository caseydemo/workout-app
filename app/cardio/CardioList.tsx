"use client";

import React from "react";
import { useCardioContext } from "./CardioProvider";
import styles from "./CardioList.module.css";

export default function CardioList() {
  const { state } = useCardioContext();

  if (!state.workouts.length) {
    return (
      <div className={styles.emptyState}>
        <p>No workouts found. Add your first cardio workout above!</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>All Cardio Workouts ({state.workouts.length})</h2>
      <div className={styles.workoutList}>
        {state.workouts.map((workout) => (
          <div key={workout._id} className={styles.workoutCard}>
            <div className={styles.workoutHeader}>
              <span className={styles.activityType}>{workout.activityType}</span>
              <span className={styles.duration}>{workout.duration} min</span>
            </div>
            {(workout.distance || workout.caloriesBurned) && (
              <div className={styles.statsGrid}>
                {workout.distance && (
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Distance</div>
                    <div className={styles.statValue}>{workout.distance} mi</div>
                  </div>
                )}
                {workout.caloriesBurned && (
                  <div className={styles.statItem}>
                    <div className={styles.statLabel}>Calories</div>
                    <div className={styles.statValue}>{workout.caloriesBurned}</div>
                  </div>
                )}
              </div>
            )}
            {workout.notes && (
              <div className={styles.notes}>
                <strong>Notes:</strong> {workout.notes}
              </div>
            )}
            <div className={styles.date}>
              {new Date(workout.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}