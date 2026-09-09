import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { gradients } from '../theme.js';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'AI Mentor', path: '/mentor', icon: <PsychologyRoundedIcon /> },
  { label: 'Adaptive Quiz', path: '/quiz', icon: <QuizRoundedIcon /> },
  { label: 'Weak Topics', path: '/weak-topics', icon: <TrendingDownRoundedIcon /> },
  { label: 'Recommendations', path: '/recommendations', icon: <LightbulbRoundedIcon /> },
  { label: 'Study Plan', path: '/study-plan', icon: <EventNoteRoundedIcon /> },
  { label: 'Progress', path: '/progress', icon: <ShowChartRoundedIcon /> },
  { label: 'Profile', path: '/profile', icon: <PersonRoundedIcon /> },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: gradients.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(192, 38, 211, 0.3)',
            }}
          >
            <SchoolRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
              AI Learning
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Smart Mentor
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 1.5 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                py: 1.1,
                '&.Mui-selected': {
                  backgroundImage: gradients.accent,
                  color: '#fff',
                  boxShadow: '0 4px 14px rgba(192, 38, 211, 0.3)',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&:hover': { backgroundImage: gradients.accent, filter: 'brightness(1.06)' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#fff' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: 14.5, fontWeight: isActive ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2.5 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" color="text.secondary" display="block">
          AI Smart Learning Mentor
        </Typography>
        <Typography variant="caption" color="text.secondary">
          v1.0 · Hackathon Build
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(23,27,51,0.06)',
          },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
}
