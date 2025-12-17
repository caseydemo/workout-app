"use client";
import { useStrengthContext } from "./StrengthProvider";
import styles from "./StrengthList.module.css";

export default function StrengthList() {

    const { state } = useStrengthContext();

    console.log("strength state: ", state);

    if (!state.workouts.length) {
        return (
            <div className={styles.emptyState}>
                <p>No strength workouts found. Add your first workout above!</p>
            </div>
        );
    }

    console.log("strength workouts: ", state.workouts);

    return (
        <section className={styles.container}>
            <h2 className={styles.header}>All Strength Workouts ({state.workouts.length})</h2>
            <div className={styles.workoutList}>
                {state.workouts.map((workout) => (
                    <div key={workout._id} className={styles.workoutCard}>
                        <div className={styles.workoutHeader}>
                            <span className={styles.exerciseName}>{workout.exerciseName}</span>
                            <span className={styles.workoutDetails}>
                                {workout.sets} × {workout.reps} @ {workout.weight} lbs
                            </span>
                        </div>
                        <div className={styles.statsGrid}>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Sets</div>
                                <div className={styles.statValue}>{workout.sets}</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Reps</div>
                                <div className={styles.statValue}>{workout.reps}</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Weight</div>
                                <div className={styles.statValue}>{workout.weight} lbs</div>
                            </div>
                        </div>
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
        </section>
    )
}