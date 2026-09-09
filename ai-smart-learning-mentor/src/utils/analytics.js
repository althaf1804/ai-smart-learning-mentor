// src/utils/analytics.js
// All dashboard/statistics logic. Everything here reads from LocalStorage
// (via storage.js) and computes results dynamically — nothing hardcoded.

import { getData, STORAGE_KEYS } from './storage';
import { TOPICS } from '../data/quizData';

/**
 * Returns the raw list of quiz results, newest last.
 * Each result: { id, topic, score, total, percentage, correct, wrong,
 *                difficulty, date, difficultyBreakdown }
 */
export function getQuizResults() {
  return getData(STORAGE_KEYS.QUIZ_RESULTS, []);
}

/**
 * Average score (%) across all quiz attempts.
 */
export function calculateAverageScore() {
  const results = getQuizResults();
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.percentage, 0);
  return Math.round(total / results.length);
}

/**
 * Performance per topic: { topic, attempts, averagePercentage, status }
 */
export function calculateTopicPerformance() {
  const results = getQuizResults();
  const map = {};

  results.forEach((r) => {
    if (!map[r.topic]) {
      map[r.topic] = { topic: r.topic, attempts: 0, totalPercentage: 0 };
    }
    map[r.topic].attempts += 1;
    map[r.topic].totalPercentage += r.percentage;
  });

  return Object.values(map).map((entry) => {
    const averagePercentage = Math.round(entry.totalPercentage / entry.attempts);
    return {
      topic: entry.topic,
      attempts: entry.attempts,
      averagePercentage,
      status: classifyPerformance(averagePercentage),
    };
  });
}

export function classifyPerformance(percentage) {
  if (percentage < 50) return 'Weak';
  if (percentage < 70) return 'Needs Practice';
  return 'Strong';
}

export function getWeakTopics() {
  return calculateTopicPerformance().filter((t) => t.status === 'Weak' || t.status === 'Needs Practice');
}

export function getStrongTopics() {
  return calculateTopicPerformance().filter((t) => t.status === 'Strong');
}

/**
 * Overall progress = weighted mix of (topics attempted / total topics)
 * and (average score), capped at 100.
 */
export function calculateOverallProgress() {
  const performance = calculateTopicPerformance();
  const topicsCoverage = (performance.length / TOPICS.length) * 100;
  const avgScore = calculateAverageScore();
  const combined = Math.round(topicsCoverage * 0.4 + avgScore * 0.6);
  return Math.min(100, Math.max(0, combined));
}

/**
 * Count of "completed" topics — a topic is considered completed
 * once the student has attempted a quiz and scored 70%+ on it (best attempt).
 */
export function getCompletedTopics() {
  const performance = calculateTopicPerformance();
  return performance.filter((t) => t.averagePercentage >= 70).map((t) => t.topic);
}

/**
 * Suggest recommended topics to focus on next, based on weak topics
 * first, then topics never attempted.
 */
export function getRecommendedTopics() {
  const performance = calculateTopicPerformance();
  const attemptedTopics = performance.map((p) => p.topic);
  const weak = getWeakTopics().sort((a, b) => a.averagePercentage - b.averagePercentage);
  const notAttempted = TOPICS.filter((t) => !attemptedTopics.includes(t));

  return [...weak.map((w) => w.topic), ...notAttempted];
}

/**
 * Determine what difficulty level the NEXT quiz for a topic should use,
 * based on the most recent attempt(s) for that topic.
 * Returns: 'easy' | 'medium' | 'hard'
 */
export function getQuizDifficulty(topic) {
  const results = getQuizResults().filter((r) => r.topic === topic);
  if (results.length === 0) return 'medium';

  const last = results[results.length - 1];
  if (last.percentage < 50) return 'easy';
  if (last.percentage < 80) return 'medium';
  return 'hard';
}

/**
 * Returns a friendly adaptive-feedback message + recommended difficulty
 * based on a given percentage score.
 */
export function getAdaptiveFeedback(percentage) {
  if (percentage < 50) {
    return {
      message: 'Your fundamentals need improvement.',
      recommendation: 'Recommended: focus on easy/basic questions next.',
      nextDifficulty: 'easy',
      tone: 'error',
    };
  }
  if (percentage < 80) {
    return {
      message: "You're improving. Practice more.",
      recommendation: 'Recommended: try medium-level questions next.',
      nextDifficulty: 'medium',
      tone: 'warning',
    };
  }
  return {
    message: 'Excellent performance!',
    recommendation: 'Recommended: challenge yourself with advanced questions.',
    nextDifficulty: 'hard',
    tone: 'success',
  };
}

/**
 * Learning streak — number of consecutive days (including today) the
 * student has done at least one quiz or asked the AI Mentor a doubt.
 */
export function calculateLearningStreak() {
  const quizResults = getQuizResults();
  const doubts = getData(STORAGE_KEYS.RECENT_DOUBTS, []);

  const activityDates = new Set(
    [...quizResults, ...doubts]
      .map((item) => item.date)
      .filter(Boolean)
      .map((d) => new Date(d).toDateString())
  );

  if (activityDates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();

  while (activityDates.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/**
 * Quiz score history formatted for Recharts line chart.
 */
export function getScoreHistory() {
  const results = getQuizResults();
  return results.map((r, index) => ({
    name: `Attempt ${index + 1}`,
    date: new Date(r.date).toLocaleDateString(),
    topic: r.topic,
    score: r.percentage,
  }));
}

/**
 * Topic performance formatted for Recharts bar chart.
 */
export function getTopicChartData() {
  return calculateTopicPerformance().map((t) => ({
    topic: t.topic,
    score: t.averagePercentage,
  }));
}

/**
 * Difficulty-wise performance across all quiz attempts.
 */
export function getDifficultyPerformance() {
  const results = getQuizResults();
  const buckets = { Easy: { correct: 0, total: 0 }, Medium: { correct: 0, total: 0 }, Hard: { correct: 0, total: 0 } };

  results.forEach((r) => {
    if (!r.difficultyBreakdown) return;
    Object.entries(r.difficultyBreakdown).forEach(([diff, stats]) => {
      if (!buckets[diff]) buckets[diff] = { correct: 0, total: 0 };
      buckets[diff].correct += stats.correct;
      buckets[diff].total += stats.total;
    });
  });

  return Object.entries(buckets).map(([difficulty, stats]) => ({
    difficulty,
    percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));
}

/**
 * Study plan task completion percentage.
 */
export function getStudyPlanProgress() {
  const plan = getData(STORAGE_KEYS.STUDY_PLAN, null);
  if (!plan || !Array.isArray(plan.days) || plan.days.length === 0) return 0;
  const completed = plan.days.filter((d) => d.status === 'Completed').length;
  return Math.round((completed / plan.days.length) * 100);
}
