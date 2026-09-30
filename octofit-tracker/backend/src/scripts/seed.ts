import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { Activity, Leaderboard, Team, User, Workout } from '../models';

/**
 * Seed the octofit_db database with test data
 */
function seedId(value: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(value);
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function toUpserts<T extends { _id: mongoose.Types.ObjectId }>(records: T[]) {
  return records.map(({ _id, ...fields }) => ({
    updateOne: {
      filter: { _id },
      update: { $set: fields },
      upsert: true,
    },
  }));
}

async function seedDatabase(): Promise<void> {
  const userIds = [
    seedId('66f000000000000000000001'),
    seedId('66f000000000000000000002'),
    seedId('66f000000000000000000003'),
    seedId('66f000000000000000000004'),
    seedId('66f000000000000000000005'),
  ];
  const teamIds = [seedId('66f000000000000000000101'), seedId('66f000000000000000000102')];

  try {
    await connectDatabase();

    console.log('Seed the octofit_db database with test data');

    const users = [
      { _id: userIds[0], username: 'maya.moves', name: 'Maya Chen', email: 'maya.chen@example.com', age: 29, fitnessLevel: 'intermediate', goals: ['improve endurance', 'run a 10K'], points: 840 },
      { _id: userIds[1], username: 'jordan.trains', name: 'Jordan Lee', email: 'jordan.lee@example.com', age: 34, fitnessLevel: 'advanced', goals: ['build strength', 'maintain consistency'], points: 790 },
      { _id: userIds[2], username: 'alex.active', name: 'Alex Rivera', email: 'alex.rivera@example.com', age: 26, fitnessLevel: 'beginner', goals: ['start running', 'build a routine'], points: 625 },
      { _id: userIds[3], username: 'sam.wellness', name: 'Sam Patel', email: 'sam.patel@example.com', age: 31, fitnessLevel: 'intermediate', goals: ['increase mobility', 'improve sleep'], points: 710 },
      { _id: userIds[4], username: 'taylor.fit', name: 'Taylor Morgan', email: 'taylor.morgan@example.com', age: 38, fitnessLevel: 'beginner', goals: ['stay active', 'gain stamina'], points: 540 },
    ];

    const teams = [
      {
        _id: teamIds[0],
        name: 'Morning Miles',
        description: 'A friendly running and walking team that gets moving before work.',
        members: [userIds[0], userIds[2], userIds[4]],
      },
      {
        _id: teamIds[1],
        name: 'Strong Together',
        description: 'A balanced crew focused on strength, mobility, and steady progress.',
        members: [userIds[1], userIds[3]],
      },
    ];

    const activities = [
      { _id: seedId('66f000000000000000000201'), userId: userIds[0], activityType: 'running', durationMinutes: 42, distanceKm: 6.4, caloriesBurned: 390, completedAt: daysAgo(0), notes: 'Easy riverside run.' },
      { _id: seedId('66f000000000000000000202'), userId: userIds[1], activityType: 'strength', durationMinutes: 55, caloriesBurned: 330, completedAt: daysAgo(0), notes: 'Upper-body strength session.' },
      { _id: seedId('66f000000000000000000203'), userId: userIds[2], activityType: 'walking', durationMinutes: 35, distanceKm: 2.8, caloriesBurned: 155, completedAt: daysAgo(1), notes: 'Brisk walk after lunch.' },
      { _id: seedId('66f000000000000000000204'), userId: userIds[3], activityType: 'yoga', durationMinutes: 40, caloriesBurned: 145, completedAt: daysAgo(1), notes: 'Mobility and recovery flow.' },
      { _id: seedId('66f000000000000000000205'), userId: userIds[4], activityType: 'cycling', durationMinutes: 50, distanceKm: 16.2, caloriesBurned: 410, completedAt: daysAgo(2), notes: 'Steady ride on the greenway.' },
      { _id: seedId('66f000000000000000000206'), userId: userIds[0], activityType: 'strength', durationMinutes: 38, caloriesBurned: 245, completedAt: daysAgo(3), notes: 'Full-body dumbbell circuit.' },
      { _id: seedId('66f000000000000000000207'), userId: userIds[1], activityType: 'running', durationMinutes: 30, distanceKm: 5.1, caloriesBurned: 315, completedAt: daysAgo(4), notes: 'Tempo intervals.' },
      { _id: seedId('66f000000000000000000208'), userId: userIds[2], activityType: 'walking', durationMinutes: 28, distanceKm: 2.1, caloriesBurned: 120, completedAt: daysAgo(5), notes: 'Neighborhood walk.' },
    ];

    const leaderboardOrder = [
      { userIndex: 0, teamIndex: 0 },
      { userIndex: 1, teamIndex: 1 },
      { userIndex: 3, teamIndex: 1 },
      { userIndex: 2, teamIndex: 0 },
      { userIndex: 4, teamIndex: 0 },
    ];
    const leaderboard = leaderboardOrder.map(({ userIndex, teamIndex }, index) => {
      const user = users[userIndex];
      return {
        _id: seedId(`66f00000000000000000030${userIndex + 1}`),
        userId: user._id,
        teamId: teamIds[teamIndex],
        points: user.points,
        rank: index + 1,
        period: 'monthly',
        updatedAt: new Date(),
      };
    });

    const workouts = [
      { _id: seedId('66f000000000000000000401'), title: 'Beginner Run-Walk', description: 'A gentle interval session to build an aerobic base.', category: 'cardio', difficulty: 'beginner', durationMinutes: 25, exercises: [{ name: 'Brisk walk', durationSeconds: 180 }, { name: 'Easy jog', durationSeconds: 60 }], equipment: [], recommendedFor: ['running', 'endurance'] },
      { _id: seedId('66f000000000000000000402'), title: 'Full-Body Foundations', description: 'A simple strength circuit using controlled bodyweight movements.', category: 'full-body', difficulty: 'beginner', durationMinutes: 30, exercises: [{ name: 'Bodyweight squat', sets: 3, reps: 10 }, { name: 'Incline push-up', sets: 3, reps: 8 }, { name: 'Glute bridge', sets: 3, reps: 12 }], equipment: ['bench or sturdy chair'], recommendedFor: ['strength', 'general fitness'] },
      { _id: seedId('66f000000000000000000403'), title: 'Tempo Builder', description: 'A progressive running workout with a comfortably hard middle block.', category: 'cardio', difficulty: 'intermediate', durationMinutes: 40, exercises: [{ name: 'Easy warm-up', durationSeconds: 600 }, { name: 'Tempo run', durationSeconds: 1200 }, { name: 'Cool-down jog', durationSeconds: 600 }], equipment: [], recommendedFor: ['running', '10K training'] },
      { _id: seedId('66f000000000000000000404'), title: 'Dumbbell Strength', description: 'A balanced resistance session for the major movement patterns.', category: 'strength', difficulty: 'intermediate', durationMinutes: 45, exercises: [{ name: 'Goblet squat', sets: 3, reps: 10 }, { name: 'Dumbbell row', sets: 3, reps: 10 }, { name: 'Romanian deadlift', sets: 3, reps: 10 }], equipment: ['dumbbells'], recommendedFor: ['strength', 'muscle building'] },
      { _id: seedId('66f000000000000000000405'), title: 'Desk-Day Mobility', description: 'A short mobility sequence to loosen hips, back, and shoulders.', category: 'mobility', difficulty: 'beginner', durationMinutes: 18, exercises: [{ name: 'Cat-cow', sets: 2, reps: 8 }, { name: 'Hip flexor stretch', durationSeconds: 45 }, { name: 'Thread the needle', sets: 2, reps: 6 }], equipment: ['exercise mat'], recommendedFor: ['mobility', 'recovery'] },
    ];

    await User.bulkWrite(toUpserts(users));
    await Team.bulkWrite(toUpserts(teams));
    await Activity.bulkWrite(toUpserts(activities));
    await Leaderboard.bulkWrite(toUpserts(leaderboard));
    await Workout.bulkWrite(toUpserts(workouts));

    console.log('Database seeding complete: 5 users, 2 teams, 8 activities, 5 leaderboard entries, 5 workouts');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

seedDatabase();
