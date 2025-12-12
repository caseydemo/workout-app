"use server";
import connectDB from "../lib/db";
import Cardio, { ICardio } from "../models/Cardio";

const createCardioWorkout = async (data: ICardio) => {
    console.log("Server action called with data:", data);
    try {
        await connectDB();
        console.log("Database connected");
        const newWorkout = new Cardio({
            ...data,        
        });
        await newWorkout.save();
        console.log("Workout saved to database:", newWorkout._id);
        return JSON.parse(JSON.stringify(newWorkout));
    } catch (error) {
        console.error("Error in createCardioWorkout:", error);
        throw error;
    }
};

const getCardioWorkouts = async (id?: string) => {
    await connectDB();
    if (id) {
        const workout = await Cardio.findById(id).exec();
        return JSON.parse(JSON.stringify(workout));
    }
    const workouts = await Cardio.find().exec();
    return JSON.parse(JSON.stringify(workouts));
};

const deleteCardioWorkout = async (id: string) => {
    await connectDB();
    return await Cardio.findByIdAndDelete(id).exec();
};

export { createCardioWorkout, getCardioWorkouts, deleteCardioWorkout };