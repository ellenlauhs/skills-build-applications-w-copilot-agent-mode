import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(connectionString);
  console.log('Connected to octofit_db');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}

export default mongoose.connection;
