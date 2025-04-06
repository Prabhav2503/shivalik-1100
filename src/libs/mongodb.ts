import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

// Define the connection type
interface MongooseConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection | null> | null;
}

// Using a more specific type assertion for the global scope
const globalWithMongoose: {
  _mongooseConnection?: MongooseConnection;
} = global as any;

// Initialize the connection cache to prevent multiple connections in development
if (!globalWithMongoose._mongooseConnection) {
  globalWithMongoose._mongooseConnection = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 */
async function connectToDatabase(): Promise<typeof mongoose> {
  // If we have an existing connection, use it
  if (globalWithMongoose._mongooseConnection?.conn) {
    return mongoose;
  }

  // If there's no existing connection but a connection is in progress, wait for it
  if (!globalWithMongoose._mongooseConnection?.promise) {
    // Start a new connection
    globalWithMongoose._mongooseConnection!.promise = mongoose.connect(MONGODB_URI!)
      .then(() => mongoose.connection)
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        return null;
      });
  }

  try {
    globalWithMongoose._mongooseConnection!.conn = await globalWithMongoose._mongooseConnection!.promise;
  } catch (e) {
    console.error("Failed to establish MongoDB connection:", e);
  }

  return mongoose;
}

export default connectToDatabase;
