import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { Activity, Leaderboard, Team, User, Workout } from './models';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-${port}.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/users/', async (_request, response) => {
  const users = await User.find().lean();
  response.json(users);
});

app.get('/api/teams/', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username name').lean();
  response.json(teams);
});

app.get('/api/activities/', async (_request, response) => {
  const activities = await Activity.find()
    .sort({ completedAt: -1 })
    .populate('userId', 'username name')
    .lean();
  response.json(activities);
});

app.get('/api/leaderboard/', async (_request, response) => {
  const leaderboard = await Leaderboard.find()
    .sort({ rank: 1 })
    .populate('userId', 'username name')
    .populate('teamId', 'name')
    .lean();
  response.json(leaderboard);
});

app.get('/api/workouts/', async (_request, response) => {
  const workouts = await Workout.find().lean();
  response.json(workouts);
});

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

async function startServer(): Promise<void> {
  await connectDatabase();

  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening on port ${port}`);
    console.log(`OctoFit API base URL: ${baseUrl}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});