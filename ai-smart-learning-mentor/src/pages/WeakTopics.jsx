import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import ProgressCard from '../components/ProgressCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { calculateTopicPerformance, getTopicChartData } from '../utils/analytics';

const STATUS_COLOR = {
  Weak: '#EB5757',
  'Needs Practice': '#F5A623',
  Strong: '#2ECC71',
};

export default function WeakTopics() {
  const navigate = useNavigate();
  const performance = calculateTopicPerformance().sort(
    (a, b) => a.averagePercentage - b.averagePercentage
  );
  const chartData = getTopicChartData();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Weak Topics Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Topic-wise performance calculated from all your quiz attempts.
        </Typography>
      </Box>

      {performance.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No quiz attempts yet."
              subtitle="Take a quiz first so we can analyze your strengths and weaknesses per topic."
              actionLabel="Take a Quiz"
              onAction={() => navigate('/quiz')}
            />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Topic Breakdown
                </Typography>
                {performance.map((t) => (
                  <ProgressCard
                    key={t.topic}
                    label={t.topic}
                    percentage={t.averagePercentage}
                    status={t.status}
                    attempts={t.attempts}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Performance by Topic
                </Typography>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="topic" width={110} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {chartData.map((entry, index) => {
                        const status =
                          entry.score < 50 ? 'Weak' : entry.score < 70 ? 'Needs Practice' : 'Strong';
                        return <Cell key={index} fill={STATUS_COLOR[status]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
