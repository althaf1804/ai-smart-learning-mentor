import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, LinearProgress } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import EmptyState from '../components/EmptyState.jsx';
import {
  calculateOverallProgress,
  getScoreHistory,
  getTopicChartData,
  getStudyPlanProgress,
  getQuizResults,
  calculateAverageScore,
  calculateLearningStreak,
} from '../utils/analytics';

export default function ProgressPage() {
  const navigate = useNavigate();
  const overallProgress = calculateOverallProgress();
  const scoreHistory = getScoreHistory();
  const topicData = getTopicChartData();
  const studyPlanProgress = getStudyPlanProgress();
  const quizCount = getQuizResults().length;
  const avgScore = calculateAverageScore();
  const streak = calculateLearningStreak();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Progress Tracking
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A complete view of your learning journey, calculated live from your activity.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Overall Learning Completion
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {overallProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Study Plan Completion
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {studyPlanProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={studyPlanProgress}
                color="secondary"
                sx={{ height: 10, borderRadius: 5 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Learning Activity
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ my: 1 }}>
                {quizCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Quizzes attempted · {avgScore}% average score · {streak} day streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Quiz Score Over Time
              </Typography>
              {scoreHistory.length === 0 ? (
                <EmptyState
                  title="No quiz attempts yet."
                  subtitle="Your score trend will appear here once you take a quiz."
                  actionLabel="Take a Quiz"
                  onAction={() => navigate('/quiz')}
                />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value, key, props) => [`${value}%`, props.payload.topic]} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#C026D3"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#C026D3" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Performance by Topic
              </Typography>
              {topicData.length === 0 ? (
                <EmptyState
                  title="No topic data yet."
                  subtitle="Attempt quizzes across different topics to see a comparison here."
                />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topicData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="topic" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="score" fill="#4C2FD9" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
