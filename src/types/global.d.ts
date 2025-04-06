// types/global.d.ts
import mongoose from 'mongoose';

declare global {
  // Extend globalThis to include _mongooseConnection
  let _mongooseConnection: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

}

export {}; // Ensures this is treated as a module
