// strength model
import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface for type safety
export interface IStrength {
  userId: string;
  exerciseName: string;
  sets: number;
  repsPerSet: number;
  weight?: number; // in pounds or kilograms
  notes?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose document interface (combines IStrength with Document)
export interface IStrengthDocument extends IStrength, Document {}

// Define the schema
const StrengthSchema: Schema = new Schema<IStrengthDocument>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
        index: true, // Index for faster queries by user
    },
    exerciseName: {
      type: String,
        required: [true, "Exercise name is required"],
        trim: true,
    },
    sets: {
        type: Number,
        required: [true, "Number of sets is required"],
        min: [1, "There must be at least 1 set"],
    },
    repsPerSet: {
        type: Number,
        required: [true, "Number of reps per set is required"],
        min: [1, "There must be at least 1 rep per set"],
    },
    weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
    },
    notes: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
  },
    { timestamps: true }
);

// Create and export the model
const Strength: Model<IStrengthDocument> =
  mongoose.models.Strength ||
  mongoose.model<IStrengthDocument>("Strength", StrengthSchema);
export default Strength;
