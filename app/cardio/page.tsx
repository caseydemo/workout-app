"use server";
import CardioProvider from "./CardioProvider";
import CardioList from "./CardioList";
import AddWorkout from "./AddWorkout";
import { getCardioWorkouts } from "../actions/cardio";

export default async function CardioPage() {
    const workouts = await getCardioWorkouts();
    return (
        <main>
            <h1>Cardio Workouts</h1>
            <p>Welcome to the Cardio section! Here you'll find various cardio workouts to boost your endurance and heart health.</p>
            <CardioProvider initialWorkouts={workouts}>
                <AddWorkout />
                <CardioList />
            </CardioProvider>
        </main>
    );
}