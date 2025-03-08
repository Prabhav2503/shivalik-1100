import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

// Use a global cache to prevent multiple connections in development mode
declare global {
  var _mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize global cache if it doesn't exist
global._mongooseConnection = global._mongooseConnection || { conn: null, promise: null };

async function connectToDatabase() {
  if (global._mongooseConnection.conn) {
    return global._mongooseConnection.conn;
  }

  if (!global._mongooseConnection.promise) {
    global._mongooseConnection.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  global._mongooseConnection.conn = await global._mongooseConnection.promise;
  return global._mongooseConnection.conn;
}

export default connectToDatabase;
