import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { gradients } from '../theme.js';

export default function StatCard({ icon, label, value, suffix = '', color = 'primary.main', sub, highlight = false }) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 10px 28px rgba(76, 47, 217, 0.14)',
        },
        ...(highlight && {
          backgroundImage: gradients.primary,
          color: '#fff',
        }),
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(highlight
                ? { bgcolor: 'rgba(255,255,255,0.18)', color: '#fff' }
                : {
                    backgroundImage: gradients.primarySoft,
                    color: color,
                  }),
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ color: highlight ? 'rgba(255,255,255,0.85)' : 'text.secondary' }}
        >
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.3 }}>
          {value}
          {suffix}
        </Typography>
        {sub && (
          <Typography
            variant="caption"
            sx={{ color: highlight ? 'rgba(255,255,255,0.75)' : 'text.secondary' }}
          >
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
