import { connectDatabase, disconnectDatabase } from '../config/database';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    // TODO: Add seed data for users, teams, activities, leaderboard, and workouts

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

seedDatabase();
