"use server";
import StrengthProvider from "./StrengthProvider";
import StrengthList from "./StrengthList";
import AddWorkout from "./AddWorkout";
import { getStrengthWorkouts } from "../actions/strength";
import styles from "./page.module.css";

export default async function StrengthPage() {
    const workouts = await getStrengthWorkouts();    
    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Strength Workouts</h1>
                <p className={styles.description}>
                    Welcome to the Strength section! Here you'll find various strength training workouts to build muscle and improve overall fitness.
                </p>
            </div>
            <StrengthProvider initialWorkouts={workouts}>
                <AddWorkout />
                <StrengthList />
            </StrengthProvider>
        </main>
    )
}