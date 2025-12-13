"use server";
import connectDB from "../lib/db";
import Strength, { IStrength } from "../models/Strength";

const createStrengthWorkout = async (data: IStrength) => {
    console.log("Server action called with data:", data);
    try {
        await connectDB();
        console.log("Database connected");
        const newWorkout = new Strength({
            ...data,        
        });
        await newWorkout.save();
        console.log("Workout saved to database:", newWorkout._id);
        return JSON.parse(JSON.stringify(newWorkout));
    } catch (error) {
        console.error("Error in createStrengthWorkout:", error);
        throw error;
    }
};

const getStrengthWorkouts = async (id?: string) => {
    await connectDB();
    if (id) {
        const workout = await Strength.findById(id).exec();
        return JSON.parse(JSON.stringify(workout));
    }
    const workouts = await Strength.find().exec();
    console.log("Fetched strength workouts:", workouts);
    return JSON.parse(JSON.stringify(workouts));
};

const deleteStrengthWorkout = async (id: string) => {
    await connectDB();
    return await Strength.findByIdAndDelete(id).exec();
};

export { createStrengthWorkout, getStrengthWorkouts, deleteStrengthWorkout };