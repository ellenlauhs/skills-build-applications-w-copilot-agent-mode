import express from 'express';
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-${port}.app.github.dev`
  : `http://localhost:${port}`;

app.use(express.json());

app.get('/api/users/', (_request, response) => {
  response.json([]);
});

app.get('/api/teams/', (_request, response) => {
  response.json([]);
});

app.get('/api/activities/', (_request, response) => {
  response.json([]);
});

app.get('/api/leaderboard/', (_request, response) => {
  response.json([]);
});

app.get('/api/workouts/', (_request, response) => {
  response.json([]);
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