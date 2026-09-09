import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Chip } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { calculateLearningStreak } from '../utils/analytics';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { gradients } from '../theme.js';

export default function Navbar({ drawerWidth, onMenuClick, studentName }) {
  const streak = calculateLearningStreak();
  const initial = (studentName || 'S').trim().charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid rgba(76,47,217,0.08)',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 2,
          backgroundImage: gradients.accent,
          opacity: 0.5,
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ display: { md: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              display: { xs: 'none', sm: 'block' },
              backgroundImage: gradients.text,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            AI Smart Learning Mentor
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            icon={<LocalFireDepartmentRoundedIcon />}
            label={`${streak} day streak`}
            size="small"
            color={streak > 0 ? 'warning' : 'default'}
            variant={streak > 0 ? 'filled' : 'outlined'}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          />
          <Avatar
            sx={{
              backgroundImage: gradients.accent,
              width: 36,
              height: 36,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {initial}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
