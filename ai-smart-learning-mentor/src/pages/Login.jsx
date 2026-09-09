import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Alert,
} from '@mui/material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { saveData, STORAGE_KEYS } from '../utils/storage';
import { gradients } from '../theme.js';

export default function Login({ onLogin }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }

    const profile = {
      name: name.trim(),
      level,
      joinedDate: new Date().toISOString(),
    };

    saveData(STORAGE_KEYS.STUDENT_PROFILE, profile);
    onLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: gradients.primary,
        p: 2,
      }}
    >
      {/* Decorative glow shapes for depth */}
      <Box
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          top: -140,
          left: -140,
          background: 'radial-gradient(circle, rgba(192,38,211,0.45) 0%, rgba(192,38,211,0) 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 460,
          height: 460,
          borderRadius: '50%',
          bottom: -160,
          right: -160,
          background: 'radial-gradient(circle, rgba(76,47,217,0.5) 0%, rgba(76,47,217,0) 70%)',
        }}
      />

      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 24px 60px rgba(15, 8, 64, 0.35)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: gradients.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 20px rgba(192, 38, 211, 0.35)',
            }}
          >
            <SchoolRoundedIcon sx={{ color: '#fff', fontSize: 34 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            AI Smart Learning Mentor
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Your personalized AI-powered study companion
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            What's your name?
          </Typography>
          <TextField
            fullWidth
            placeholder="e.g. mahesh Bob"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
            autoFocus
          />

          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Your current learning level
          </Typography>
          <ToggleButtonGroup
            value={level}
            exclusive
            onChange={(e, val) => val && setLevel(val)}
            fullWidth
            sx={{ mb: 4 }}
          >
            <ToggleButton value="Beginner">Beginner</ToggleButton>
            <ToggleButton value="Intermediate">Intermediate</ToggleButton>
            <ToggleButton value="Advanced">Advanced</ToggleButton>
          </ToggleButtonGroup>

          <Button type="submit" variant="contained" fullWidth size="large">
            Start Learning
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
