"use server";
import StrengthProvider from "./StrengthProvider";
import StrengthList from "./StrengthList";
import AddWorkout from "./AddWorkout";
import { getStrengthWorkouts } from "../actions/strength";
export default async function StrengthPage() {
    const workouts = await getStrengthWorkouts();
    console.log("Strength workouts fetched:", workouts);
    return (
        <main>
            <h1>Strength Workouts</h1>
            <StrengthProvider>
            <AddWorkout />
            <StrengthList />
            <p>Welcome to the Strength section! Here you'll find various strength training workouts to build muscle and improve overall fitness.</p>
            </StrengthProvider>
        </main>
    )
}