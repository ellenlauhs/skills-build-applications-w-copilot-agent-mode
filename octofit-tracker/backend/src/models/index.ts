import { model, models, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    age: { type: Number, min: 13 },
    fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    goals: { type: [String], default: [] },
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, collection: 'users' },
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, collection: 'teams' },
);

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    activityType: {
      type: String,
      enum: ['running', 'cycling', 'strength', 'yoga', 'walking'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true, collection: 'activities' },
);

const leaderboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    period: { type: String, enum: ['weekly', 'monthly', 'all-time'], default: 'monthly' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'leaderboards' },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['cardio', 'strength', 'mobility', 'full-body'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [
      new Schema(
        {
          name: { type: String, required: true },
          sets: { type: Number, min: 1 },
          reps: { type: Number, min: 1 },
          durationSeconds: { type: Number, min: 1 },
        },
        { _id: false },
      ),
    ],
    equipment: { type: [String], default: [] },
    recommendedFor: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'workouts' },
);

export const User = models.User || model('User', userSchema);
export const Team = models.Team || model('Team', teamSchema);
export const Activity = models.Activity || model('Activity', activitySchema);
export const Leaderboard = models.Leaderboard || model('Leaderboard', leaderboardSchema);
export const Workout = models.Workout || model('Workout', workoutSchema);