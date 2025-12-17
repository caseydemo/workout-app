"use server";
import CardioProvider from "./CardioProvider";
import CardioList from "./CardioList";
import AddWorkout from "./AddWorkout";
import { getCardioWorkouts } from "../actions/cardio";
import styles from "./page.module.css";

export default async function CardioPage() {
    const workouts = await getCardioWorkouts();
    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Cardio Workouts</h1>
                <p className={styles.description}>
                    Welcome to the Cardio section! Here you'll find various cardio workouts to boost your endurance and heart health.
                </p>
            </div>
            <CardioProvider initialWorkouts={workouts}>
                <AddWorkout />
                <CardioList />
            </CardioProvider>
        </main>
    );
}