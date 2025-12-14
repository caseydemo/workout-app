"use client";
import { useStrengthContext } from "./StrengthProvider";

export default function StrengthList() {

    const { state } = useStrengthContext();

    console.log("strength state: ", state);

    if (!state.workouts.length) return <p>No strength workouts found.</p>;

    console.log("strength workouts: ", state.workouts);

    return (
        <section>
            <h2>All Strength Workouts ({state.workouts.length})</h2>
            {state.workouts.map((workout) => (
                <div key={workout._id} style={{ padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "4px" }}>
                    <strong>{workout.exerciseName}</strong> - {workout.sets} sets x {workout.reps} reps @ {workout.weight} lbs
                    {workout.notes && <div>Notes: {workout.notes}</div>}
                    <div>Date: {new Date(workout.date).toLocaleDateString()}</div>
                </div>            
            ))}
        </section>
    )
}