import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

import { askAI, isGeminiConfigured } from '../services/aiService';
import { getData, appendToList, STORAGE_KEYS } from '../utils/storage';
import EmptyState from '../components/EmptyState.jsx';

export default function AIMentor({ profile }) {
  const [question, setQuestion] = useState('');
  const [level, setLevel] = useState(profile?.level || 'Beginner');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [recentDoubts, setRecentDoubts] = useState(() =>
    getData(STORAGE_KEYS.RECENT_DOUBTS, [])
  );

  const geminiActive = isGeminiConfigured();

  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);
    setResponse(null);

    try {
      const result = await askAI(question, level.toLowerCase());
      setResponse(result);

      const entry = {
        id: `doubt_${Date.now()}`,
        question: question.trim(),
        level,
        date: new Date().toISOString(),
        response: result,
      };

      const updated = appendToList(STORAGE_KEYS.RECENT_DOUBTS, entry, 30);
      setRecentDoubts(updated);
    } catch (err) {
      // askAI should never throw, but guard anyway
      console.error('Unexpected AI Mentor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          AI Mentor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask any doubt and get an explanation tailored to your knowledge level.
        </Typography>
      </Box>

      {!geminiActive && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Running in offline mode with built-in smart responses (Gemini API key not configured).
          Try asking about  Data science,DBMS, JavaScript, Python, Computer Networks, or Data Structures.
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Your knowledge level for this question
          </Typography>
          <ToggleButtonGroup
            value={level}
            exclusive
            onChange={(e, val) => val && setLevel(val)}
            sx={{ mb: 2.5, flexWrap: 'wrap' }}
          >
            <ToggleButton value="Beginner">Beginner</ToggleButton>
            <ToggleButton value="Intermediate">Intermediate</ToggleButton>
            <ToggleButton value="Advanced">Advanced</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="e.g. Explain normalization in DBMS"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
            onClick={handleAsk}
            disabled={loading || !question.trim()}
          >
            {loading ? 'Thinking...' : 'Ask AI Mentor'}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeRoundedIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Simple Explanation
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2.5 }}>
              {response.simpleExplanation}
            </Typography>

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Example
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              {response.example}
            </Typography>

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Key Points
            </Typography>
            <List dense sx={{ mb: 1 }}>
              {response.keyPoints?.map((point, idx) => (
                <ListItem key={idx} sx={{ py: 0.4, pl: 0 }}>
                  <LightbulbRoundedIcon fontSize="small" sx={{ mr: 1.5, color: 'warning.main' }} />
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <HelpOutlineRoundedIcon color="secondary" sx={{ mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Quick Check
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {response.quickCheck}
                </Typography>
              </Box>
            </Box>

            <Chip
              size="small"
              label={response.source === 'gemini' ? 'Answered by Gemini AI' : 'Offline smart response'}
              sx={{ mt: 2 }}
              color={response.source === 'gemini' ? 'primary' : 'default'}
              variant="outlined"
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Recent Doubts
          </Typography>
          {recentDoubts.length === 0 ? (
            <EmptyState
              title="No doubts asked yet."
              subtitle="Ask your first question above and it will appear here for quick reference."
            />
          ) : (
            [...recentDoubts]
              .reverse()
              .slice(0, 8)
              .map((d) => (
                <Box
                  key={d.id}
                  sx={{ py: 1.3, borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight={600}>
                      {d.question}
                    </Typography>
                    <Chip label={d.level} size="small" variant="outlined" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(d.date).toLocaleString()}
                  </Typography>
                </Box>
              ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
