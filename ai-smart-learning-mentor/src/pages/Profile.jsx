import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';

import {
  calculateAverageScore,
  calculateTopicPerformance,
  getCompletedTopics,
} from '../utils/analytics';
import { saveData, STORAGE_KEYS } from '../utils/storage';

export default function Profile({ profile, onProfileUpdate }) {
  const [level, setLevel] = useState(profile.level);
  const [saved, setSaved] = useState(false);

  const avgScore = calculateAverageScore();
  const topicsAttempted = calculateTopicPerformance().length;
  const completedTopics = getCompletedTopics();

  const handleSave = () => {
    const updated = { ...profile, level };
    saveData(STORAGE_KEYS.STUDENT_PROFILE, updated);
    onProfileUpdate();
    setSaved(true);
  };

  const initial = (profile.name || 'S').trim().charAt(0).toUpperCase();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your learning profile and preferences.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 84,
                  height: 84,
                  fontSize: 32,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {initial}
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.level} Learner
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Joined {new Date(profile.joinedDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Learning Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {topicsAttempted}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Topics Attempted
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" fontWeight={700} color="secondary.main">
                    {avgScore}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Average Score
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {completedTopics.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed Topics
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Update Learning Level
              </Typography>
              <ToggleButtonGroup
                value={level}
                exclusive
                onChange={(e, val) => val && setLevel(val)}
                fullWidth
                sx={{ mb: 2.5 }}
              >
                <ToggleButton value="Beginner">Beginner</ToggleButton>
                <ToggleButton value="Intermediate">Intermediate</ToggleButton>
                <ToggleButton value="Advanced">Advanced</ToggleButton>
              </ToggleButtonGroup>
              <Divider sx={{ mb: 2.5 }} />
              <Button variant="contained" onClick={handleSave} disabled={level === profile.level}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)}>
        <Alert severity="success" onClose={() => setSaved(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
