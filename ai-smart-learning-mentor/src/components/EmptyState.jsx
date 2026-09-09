import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

export default function EmptyState({
  title = 'No data yet.',
  subtitle = '',
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'rgba(76, 47, 217, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          mb: 1,
        }}
      >
        {icon || <InsightsRoundedIcon fontSize="large" />}
      </Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
          {subtitle}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1.5 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
