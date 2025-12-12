import mongoose from "mongoose";

// Retrieve the MongoDB connection string from environment variables
// Falls back to empty string if not defined (which will trigger an error below)
const MONGODB_URI = process.env.MONGODB_URI || "";

// Validate that the MongoDB URI is provided
// This fails fast if the environment variable is missing, preventing runtime issues
if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local"
	);
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
// Interface defining the structure of our cached connection object
interface CachedConnection {
	conn: typeof mongoose | null; // Stores the active mongoose connection, or null if not connected
	promise: Promise<typeof mongoose> | null; // Stores the connection promise while connecting, or null if not in progress
}

// Extend the global namespace to include our mongoose cache
// This allows us to persist the connection across module reloads in development
declare global {
	var mongoose: CachedConnection | undefined;
}

// Initialize the cached connection object
// Use the global cache if it exists, otherwise create a new one
const cached: CachedConnection = global.mongoose || {
	conn: null,
	promise: null,
};

// Store the cache in the global scope if it doesn't already exist
// This ensures the same connection is reused across hot reloads in development
if (!global.mongoose) {
	global.mongoose = cached;
}

/**
 * Establishes and manages a connection to MongoDB
 * Uses connection caching to prevent creating multiple connections
 * @returns Promise that resolves to the mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
	// If we already have an active connection, return it immediately
	// This avoids creating redundant connections
	if (cached.conn) {
		return cached.conn;
	}

	// If no connection is in progress, start a new one
	if (!cached.promise) {
		// Connection options
		const opts = {
			bufferCommands: false, // Disable command buffering - fail fast if not connected
		};

		// Create and cache the connection promise
		// This prevents multiple simultaneous connection attempts
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				return mongoose;
			});
	}

	// Wait for the connection to complete
	try {
		// Store the resolved connection in the cache
		cached.conn = await cached.promise;
	} catch (e) {
		// If connection fails, reset the promise so the next call can retry
		cached.promise = null;
		throw e; // Re-throw the error for the caller to handle
	}

	// Return the established connection
	return cached.conn;
}

export default connectDB;
