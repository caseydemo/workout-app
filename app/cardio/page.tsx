"use server";
import CardioProvider from "./CardioProvider";
// cardio provider
// cardio list
// add workout component
// get all cardio workouts
import { createCardioWorkout, getCardioWorkouts } from "../actions/cardio";

export default async function CardioPage() {
    console.log("this is the back end cardio page");
    return (
        <main>
            <h1>Cardio</h1>
            <CardioProvider>
                this is the children
            </CardioProvider>
        </main>
    )
}