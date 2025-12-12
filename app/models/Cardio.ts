import mongoose, { Schema, Model, Document } from "mongoose";

// TypeScript interface for type safety
export interface ICardio {
	userId: string;
	activityType: string;
	duration: number; // in minutes
	distance?: number; // in miles or kilometers
	caloriesBurned?: number;
	averageHeartRate?: number;
	notes?: string;
	date: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

// Mongoose document interface (combines ICardio with Document)
export interface ICardioDocument extends ICardio, Document {}

// Define the schema
const CardioSchema = new Schema<ICardioDocument>(
	{
		userId: {
			type: String,
			required: [true, "User ID is required"],
			index: true, // Index for faster queries by user
		},
		activityType: {
			type: String,
			required: [true, "Activity type is required"],
			enum: [
				"running",
				"cycling",
				"swimming",
				"walking",
				"rowing",
				"elliptical",
				"other",
			],
			lowercase: true,
			trim: true,
		},
		duration: {
			type: Number,
			required: [true, "Duration is required"],
			min: [1, "Duration must be at least 1 minute"],
		},
		distance: {
			type: Number,
			min: [0, "Distance cannot be negative"],
		},
		caloriesBurned: {
			type: Number,
			min: [0, "Calories burned cannot be negative"],
		},
		averageHeartRate: {
			type: Number,
			min: [0, "Heart rate cannot be negative"],
			max: [250, "Heart rate seems unrealistic"],
		},
		notes: {
			type: String,
			maxlength: [500, "Notes cannot exceed 500 characters"],
			trim: true,
		},
		date: {
			type: Date,
			required: [true, "Date is required"],
			default: Date.now,
			index: true, // Index for sorting and filtering by date
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
	}
);

// Compound index for efficient queries by user and date
CardioSchema.index({ userId: 1, date: -1 });

// Pre-save middleware example (optional)
CardioSchema.pre("save", function (next) {
	// You can add custom logic here, e.g., calculating calories if not provided
	if (!this.caloriesBurned && this.duration) {
		// Simple estimation: 10 calories per minute (adjust based on activity)
		this.caloriesBurned = this.duration * 10;
	}	
});

// Static method example (optional)
CardioSchema.statics.findByUser = function (userId: string) {
	return this.find({ userId }).sort({ date: -1 });
};

// Instance method example (optional)
CardioSchema.methods.getSummary = function () {
	return `${this.activityType} - ${
		this.duration
	} min on ${this.date.toLocaleDateString()}`;
};

// Prevent model recompilation in Next.js development
const Cardio: Model<ICardioDocument> =
	mongoose.models.Cardio ||
	mongoose.model<ICardioDocument>("Cardio", CardioSchema);

export default Cardio;
