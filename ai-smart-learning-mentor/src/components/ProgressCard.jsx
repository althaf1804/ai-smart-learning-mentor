import React from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';

const STATUS_COLORS = {
  Weak: 'error',
  'Needs Practice': 'warning',
  Strong: 'success',
};

export default function ProgressCard({ label, percentage, status, attempts }) {
  const color = STATUS_COLORS[status] || 'primary';

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" fontWeight={600}>
            {label}
          </Typography>
          {status && <Chip label={status} size="small" color={color} sx={{ height: 22 }} />}
        </Box>
        <Typography variant="body2" fontWeight={700} color="text.secondary">
          {percentage}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={color === 'error' ? 'error' : color === 'warning' ? 'warning' : 'success'}
        sx={{ height: 9, borderRadius: 5, bgcolor: 'rgba(0,0,0,0.06)' }}
      />
      {attempts !== undefined && (
        <Typography variant="caption" color="text.secondary">
          {attempts} attempt{attempts === 1 ? '' : 's'}
        </Typography>
      )}
    </Box>
  );
}
