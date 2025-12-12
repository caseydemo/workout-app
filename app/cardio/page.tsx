"use client";
import { useEffect, useState } from "react";
import { createCardioWorkout, getCardioWorkouts } from "../actions/cardio";

export default function Page() {
    const [insertStatus, setInsertStatus] = useState<string>("");
    const [workouts, setWorkouts] = useState<any[]>([]);

    useEffect(() => {
        const insertAndFetchData = async () => {
            try {
                console.log("Starting data insertion...");
                setInsertStatus("Inserting test data...");

                // Insert first cardio record
                console.log("Inserting first record...");
                const result1 = await createCardioWorkout({
                    userId: "user123",
                    activityType: "running",
                    duration: 30,
                    distance: 3.5,
                    caloriesBurned: 300,
                    averageHeartRate: 145,
                    notes: "Morning run in the park",
                    date: new Date(),
                });
                console.log("First record inserted:", result1);

                // Insert second cardio record
                console.log("Inserting second record...");
                const result2 = await createCardioWorkout({
                    userId: "user123",
                    activityType: "cycling",
                    duration: 45,
                    distance: 12,
                    caloriesBurned: 450,
                    averageHeartRate: 135,
                    notes: "Evening bike ride",
                    date: new Date(),
                });
                console.log("Second record inserted:", result2);

                setInsertStatus("Successfully inserted 2 cardio records!");
                
                // Fetch all workouts to display
                const allWorkouts = await getCardioWorkouts();
                console.log("Fetched workouts:", allWorkouts);
                setWorkouts(allWorkouts);
            } catch (error) {
                console.error("Error inserting data:", error);
                setInsertStatus(`Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
            }
        };

        insertAndFetchData();
    }, []);

    return (
        <main>
            <h1>Cardio Workouts</h1>
            <p>Welcome to the Cardio section! Here you'll find various cardio workouts to boost your endurance and heart health.</p>
            {insertStatus && (
                <div style={{ 
                    marginTop: "20px", 
                    padding: "10px", 
                    backgroundColor: insertStatus.includes("Error") ? "#ffebee" : "#e8f5e9",
                    border: insertStatus.includes("Error") ? "1px solid #f44336" : "1px solid #4caf50",
                    borderRadius: "4px"
                }}>
                    <p>{insertStatus}</p>
                </div>
            )}
            
            {workouts.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h2>All Cardio Workouts in Database ({workouts.length})</h2>
                    {workouts.map((workout, idx) => (
                        <div key={idx} style={{ 
                            padding: "10px", 
                            margin: "10px 0", 
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}>
                            <strong>{workout.activityType}</strong> - {workout.duration} minutes
                            <br />
                            Distance: {workout.distance} miles | Calories: {workout.caloriesBurned}
                            <br />
                            Notes: {workout.notes}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}