import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';

import EmptyState from '../components/EmptyState.jsx';
import { saveData, getData, STORAGE_KEYS } from '../utils/storage';

const GOALS = [
  'Improve DBMS',
  'Prepare for Exams',
  'Learn React',
  'Improve Programming',
  'Complete a Subject',
];

const DURATIONS = [3, 5, 7, 14];
const DAILY_TIME_OPTIONS = ['30 minutes', '1 hour', '2 hours'];

const TOPIC_LIBRARY = {
  'Improve DBMS': [
    'DBMS Fundamentals',
    'ER Model',
    'Normalization',
    'SQL Basics',
    'Advanced SQL',
    'Transactions & ACID',
    'Indexing & Optimization',
    'Practice Questions',
    'Mock Test',
    'Final Quiz',
  ],
  'Prepare for Exams': [
    'Syllabus Overview',
    'Core Concepts Review',
    'Important Formulas/Definitions',
    'Practice Problem Sets',
    'Previous Year Questions',
    'Weak Topic Revision',
    'Timed Mock Test',
    'Final Revision',
  ],
  'Learn React': [
    'React & JSX Basics',
    'Components & Props',
    'State & useState',
    'useEffect & Side Effects',
    'Forms & Events',
    'React Router Basics',
    'Building a Mini Project',
    'Hooks Deep Dive',
    'Performance Optimization',
    'Final Project Review',
  ],
  'Improve Programming': [
    'Programming Fundamentals',
    'Data Types & Control Flow',
    'Functions & Recursion',
    'Arrays & Strings Practice',
    'Object-Oriented Concepts',
    'Problem Solving Patterns',
    'Debugging Practice',
    'Coding Challenge Set',
    'Mini Project Build',
    'Final Assessment',
  ],
  'Complete a Subject': [
    'Subject Overview & Roadmap',
    'Module 1 Deep Dive',
    'Module 2 Deep Dive',
    'Module 3 Deep Dive',
    'Practice Exercises',
    'Doubt Clearing Session',
    'Revision Notes',
    'Practice Test',
    'Weak Area Focus',
    'Final Quiz',
  ],
};

function generatePlan(goal, duration, dailyTime) {
  const topics = TOPIC_LIBRARY[goal] || TOPIC_LIBRARY['Complete a Subject'];
  const days = [];

  for (let i = 0; i < duration; i++) {
    const topic = topics[i % topics.length];
    days.push({
      day: i + 1,
      topic: i === duration - 1 ? 'Final Quiz / Review' : topic,
      duration: dailyTime,
      status: 'Not Started',
    });
  }

  return {
    id: `plan_${Date.now()}`,
    goal,
    durationDays: duration,
    dailyTime,
    createdAt: new Date().toISOString(),
    days,
  };
}

const STATUS_CYCLE = ['Not Started', 'In Progress', 'Completed'];
const STATUS_ICON = {
  'Not Started': <RadioButtonUncheckedRoundedIcon color="disabled" />,
  'In Progress': <PendingRoundedIcon color="warning" />,
  Completed: <CheckCircleRoundedIcon color="success" />,
};

export default function StudyPlan() {
  const [goal, setGoal] = useState('Improve DBMS');
  const [duration, setDuration] = useState(7);
  const [dailyTime, setDailyTime] = useState('1 hour');
  const [plan, setPlan] = useState(() => getData(STORAGE_KEYS.STUDY_PLAN, null));

  const handleGenerate = () => {
    const newPlan = generatePlan(goal, duration, dailyTime);
    setPlan(newPlan);
    saveData(STORAGE_KEYS.STUDY_PLAN, newPlan);
  };

  const cycleStatus = (dayIndex) => {
    if (!plan) return;
    const updatedDays = plan.days.map((d, idx) => {
      if (idx !== dayIndex) return d;
      const currentPos = STATUS_CYCLE.indexOf(d.status);
      const nextStatus = STATUS_CYCLE[(currentPos + 1) % STATUS_CYCLE.length];
      return { ...d, status: nextStatus };
    });
    const updatedPlan = { ...plan, days: updatedDays };
    setPlan(updatedPlan);
    saveData(STORAGE_KEYS.STUDY_PLAN, updatedPlan);
  };

  const completedCount = plan ? plan.days.filter((d) => d.status === 'Completed').length : 0;
  const progressPercent = plan ? Math.round((completedCount / plan.days.length) * 100) : 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          AI Study Plan
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate a personalized day-by-day study plan based on your goal and available time.
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Learning Goal</InputLabel>
                <Select value={goal} label="Learning Goal" onChange={(e) => setGoal(e.target.value)}>
                  {GOALS.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                Duration
              </Typography>
              <ToggleButtonGroup
                value={duration}
                exclusive
                onChange={(e, val) => val && setDuration(val)}
                fullWidth
                size="small"
              >
                {DURATIONS.map((d) => (
                  <ToggleButton key={d} value={d}>
                    {d} Days
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Daily Study Time</InputLabel>
                <Select
                  value={dailyTime}
                  label="Daily Study Time"
                  onChange={(e) => setDailyTime(e.target.value)}
                >
                  {DAILY_TIME_OPTIONS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            startIcon={<AutoAwesomeRoundedIcon />}
            sx={{ mt: 3 }}
            onClick={handleGenerate}
          >
            Generate Study Plan
          </Button>
        </CardContent>
      </Card>

      {!plan ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No study plan yet."
              subtitle="Choose a goal, duration, and daily time above, then generate your personalized plan."
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                {plan.durationDays}-Day {plan.goal} Plan
              </Typography>
              <Chip label={`${progressPercent}% complete`} color="primary" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ mb: 3, height: 8, borderRadius: 5 }}
            />

            <Grid container spacing={2}>
              {plan.days.map((d, idx) => (
                <Grid item xs={12} sm={6} md={4} key={d.day}>
                  <Box
                    sx={{
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 2.5,
                      p: 2,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                    onClick={() => cycleStatus(idx)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" fontWeight={700} color="primary.main">
                        DAY {d.day}
                      </Typography>
                      {STATUS_ICON[d.status]}
                    </Box>
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                      {d.topic}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {d.duration}
                    </Typography>
                    <Chip
                      label={d.status}
                      size="small"
                      color={
                        d.status === 'Completed'
                          ? 'success'
                          : d.status === 'In Progress'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Tap a day card to cycle its status: Not Started → In Progress → Completed.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
