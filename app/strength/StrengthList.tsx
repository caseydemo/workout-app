"use client";
import { useStrengthContext } from "./StrengthProvider";

export default function StrengthList() {

    const { state } = useStrengthContext();

    if (!state.workouts.length) return <p>No strength workouts found.</p>;

    return (
        <section>
            this is the strength list
        </section>
    )
}