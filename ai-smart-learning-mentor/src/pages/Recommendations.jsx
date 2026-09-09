import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';

import EmptyState from '../components/EmptyState.jsx';
import { calculateTopicPerformance, getWeakTopics } from '../utils/analytics';
import { saveData, getData, STORAGE_KEYS } from '../utils/storage';

const ACTION_BANK = {
  DBMS: [
    'Revise DBMS fundamentals and ER modeling',
    'Learn Normalization (1NF, 2NF, 3NF, BCNF)',
    'Practice writing SQL queries daily',
    'Take another DBMS quiz to measure improvement',
  ],
  'Computer Networks': [
    'Revisit the OSI and TCP/IP models',
    'Understand TCP vs UDP with real examples',
    'Practice subnetting problems',
    'Take another Computer Networks quiz',
  ],
  JavaScript: [
    'Revise core JS fundamentals (variables, functions, scope)',
    'Practice closures and async/await with small exercises',
    'Build a mini project using array methods (map/filter/reduce)',
    'Take another JavaScript quiz to track progress',
  ],
  React: [
    'Revise components, props, and state basics',
    'Practice building components using hooks (useState, useEffect)',
    'Build a small project like a to-do app',
    'Take another React quiz to track progress',
  ],
  Python: [
    'Revise Python syntax, data types, and functions',
    'Practice list/dict comprehensions',
    'Build a small automation script',
    'Take another Python quiz to track progress',
  ],
  'Data Structures': [
    'Revise Arrays, Stacks, and Queues fundamentals',
    'Practice tree traversal problems (BFS/DFS)',
    'Solve 5 practice problems on sorting algorithms',
    'Take another Data Structures quiz to track progress',
  ],
};

function difficultyForScore(score) {
  if (score < 50) return 'Basic';
  if (score < 70) return 'Medium';
  return 'Advanced';
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const performance = calculateTopicPerformance();
    const weak = getWeakTopics().sort((a, b) => a.averagePercentage - b.averagePercentage);

    const generated = weak.map((topic) => ({
      topic: topic.topic,
      score: topic.averagePercentage,
      reason: `Your ${topic.topic} score is ${topic.averagePercentage}%.`,
      difficulty: difficultyForScore(topic.averagePercentage),
      actions: ACTION_BANK[topic.topic] || [
        `Revise ${topic.topic} fundamentals`,
        `Practice more ${topic.topic} problems`,
        `Take another ${topic.topic} quiz`,
      ],
    }));

    setRecommendations(generated);
    saveData(STORAGE_KEYS.RECOMMENDATIONS, generated);
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Personalized Recommendations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Auto-generated based on your weak topics from quiz performance.
        </Typography>
      </Box>

      {recommendations.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No recommendations yet."
              subtitle="Complete a few quizzes so we can identify areas to improve and suggest a focused plan."
              actionLabel="Take a Quiz"
              onAction={() => navigate('/quiz')}
            />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {recommendations.map((rec) => (
            <Grid item xs={12} md={6} key={rec.topic}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {rec.topic}
                    </Typography>
                    <Chip
                      label={rec.difficulty}
                      size="small"
                      color={rec.difficulty === 'Basic' ? 'error' : rec.difficulty === 'Medium' ? 'warning' : 'success'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {rec.reason}
                  </Typography>

                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                    Recommended actions
                  </Typography>
                  <List dense>
                    {rec.actions.map((action, idx) => (
                      <ListItem key={idx} sx={{ py: 0.3, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 26 }}>
                          <ArrowRightRoundedIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={action} />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="outlined"
                    startIcon={<PlayCircleRoundedIcon />}
                    sx={{ mt: 1.5 }}
                    onClick={() => navigate('/quiz')}
                  >
                    Practice {rec.topic}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
