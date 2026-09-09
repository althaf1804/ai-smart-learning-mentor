import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { getData, STORAGE_KEYS } from './utils/storage';

import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AIMentor from './pages/AIMentor.jsx';
import AdaptiveQuiz from './pages/AdaptiveQuiz.jsx';
import WeakTopics from './pages/WeakTopics.jsx';
import Recommendations from './pages/Recommendations.jsx';
import StudyPlan from './pages/StudyPlan.jsx';
import ProgressPage from './pages/Progress.jsx';
import Profile from './pages/Profile.jsx';

const DRAWER_WIDTH = 260;

export default function App() {
  const [profile, setProfile] = useState(() => getData(STORAGE_KEYS.STUDENT_PROFILE, null));
  const [mobileOpen, setMobileOpen] = useState(false);

  const refreshProfile = useCallback(() => {
    setProfile(getData(STORAGE_KEYS.STUDENT_PROFILE, null));
  }, []);

  useEffect(() => {
    // Keep profile in sync if changed elsewhere (e.g. Profile page)
    const handleStorage = () => refreshProfile();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshProfile]);

  if (!profile) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={refreshProfile} />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar
        drawerWidth={DRAWER_WIDTH}
        onMenuClick={() => setMobileOpen((prev) => !prev)}
        studentName={profile.name}
      />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard profile={profile} />} />
          <Route path="/mentor" element={<AIMentor profile={profile} />} />
          <Route path="/quiz" element={<AdaptiveQuiz />} />
          <Route path="/weak-topics" element={<WeakTopics />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route
            path="/profile"
            element={<Profile profile={profile} onProfileUpdate={refreshProfile} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
