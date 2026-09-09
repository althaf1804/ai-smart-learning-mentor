import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import {
  calculateOverallProgress,
  calculateAverageScore,
  getCompletedTopics,
  getWeakTopics,
  getRecommendedTopics,
  getScoreHistory,
  getQuizResults,
  calculateLearningStreak,
} from '../utils/analytics';

export default function Dashboard({ profile }) {
  const navigate = useNavigate();

  const overallProgress = calculateOverallProgress();
  const avgScore = calculateAverageScore();
  const completedTopics = getCompletedTopics();
  const weakTopics = getWeakTopics();
  const recommended = getRecommendedTopics();
  const scoreHistory = getScoreHistory();
  const recentResults = getQuizResults().slice(-5).reverse();
  const streak = calculateLearningStreak();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome, {profile.name} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's a snapshot of your learning journey so far.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpRoundedIcon />}
            label="Overall Progress"
            value={overallProgress}
            suffix="%"
            color="primary.main"
            highlight
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EmojiEventsRoundedIcon />}
            label="Average Quiz Score"
            value={avgScore}
            suffix="%"
            color="secondary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircleRoundedIcon />}
            label="Topics Completed"
            value={completedTopics.length}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ErrorRoundedIcon />}
            label="Weak Topics"
            value={weakTopics.length}
            color="error.main"
            sub={`${streak} day learning streak 🔥`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Recent Quiz Performance
              </Typography>
              {scoreHistory.length === 0 ? (
                <EmptyState
                  title="No quiz attempts yet."
                  subtitle="Take your first quiz to discover your learning strengths."
                  actionLabel="Take a Quiz"
                  onAction={() => navigate('/quiz')}
                />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, key, props) => [`${value}%`, props.payload.topic]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#4C2FD9"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#4C2FD9" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Recommended Next Topic
                </Typography>
              </Box>
              {recommended.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Great job! You're doing well across all topics.
                </Typography>
              ) : (
                <Box>
                  <Chip
                    label={recommended[0]}
                    color="primary"
                    sx={{ fontSize: 15, py: 2.5, px: 1, mb: 1.5 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Focusing on this topic next will have the biggest impact on your overall
                    progress.
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate('/quiz')}
                    fullWidth
                  >
                    Practice {recommended[0]}
                  </Button>
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Recent Attempts
                </Typography>
                {recentResults.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    No attempts yet.
                  </Typography>
                ) : (
                  recentResults.map((r) => (
                    <Box
                      key={r.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <Typography variant="body2">{r.topic}</Typography>
                      <Chip
                        size="small"
                        label={`${r.percentage}%`}
                        color={
                          r.percentage >= 70
                            ? 'success'
                            : r.percentage >= 50
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
