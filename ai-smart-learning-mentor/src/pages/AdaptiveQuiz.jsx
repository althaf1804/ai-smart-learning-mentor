import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';

import { TOPICS, getAdaptiveQuestions } from '../data/quizData';
import { appendToList, STORAGE_KEYS } from '../utils/storage';
import { getQuizDifficulty, getAdaptiveFeedback } from '../utils/analytics';

const STAGE = { SELECT: 'select', QUIZ: 'quiz', RESULT: 'result' };

export default function AdaptiveQuiz() {
  const [stage, setStage] = useState(STAGE.SELECT);
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [difficultyUsed, setDifficultyUsed] = useState('medium');

  const startQuiz = (selectedTopic) => {
    const suggestedDifficulty = getQuizDifficulty(selectedTopic);
    const qs = getAdaptiveQuestions(selectedTopic, suggestedDifficulty, 5);
    setTopic(selectedTopic);
    setQuestions(qs);
    setDifficultyUsed(suggestedDifficulty);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setStage(STAGE.QUIZ);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    const newAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selected: selectedOption,
        correct: isCorrect,
        difficulty: currentQuestion.difficulty,
      },
    ];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers) => {
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const total = finalAnswers.length;
    const percentage = Math.round((correctCount / total) * 100);

    const difficultyBreakdown = {};
    finalAnswers.forEach((a) => {
      if (!difficultyBreakdown[a.difficulty]) {
        difficultyBreakdown[a.difficulty] = { correct: 0, total: 0 };
      }
      difficultyBreakdown[a.difficulty].total += 1;
      if (a.correct) difficultyBreakdown[a.difficulty].correct += 1;
    });

    const result = {
      id: `quiz_${Date.now()}`,
      topic,
      score: correctCount,
      total,
      percentage,
      correct: correctCount,
      wrong: total - correctCount,
      difficulty: difficultyUsed,
      date: new Date().toISOString(),
      difficultyBreakdown,
    };

    appendToList(STORAGE_KEYS.QUIZ_RESULTS, result, 100);
    setStage(STAGE.RESULT);
  };

  const resetQuiz = () => {
    setStage(STAGE.SELECT);
    setTopic(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
  };

  // ---------- SELECT STAGE ----------
  if (stage === STAGE.SELECT) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            Adaptive Quiz
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pick a topic. Question difficulty adapts based on your past performance.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {TOPICS.map((t) => {
            const suggestedDifficulty = getQuizDifficulty(t);
            return (
              <Grid item xs={12} sm={6} md={4} key={t}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(23,27,51,0.1)' },
                  }}
                  onClick={() => startQuiz(t)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '12px',
                        bgcolor: 'rgba(76,47,217,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        mb: 1.5,
                      }}
                    >
                      <CodeRoundedIcon />
                    </Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                      {t}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      5 questions
                    </Typography>
                    <Box sx={{ mt: 1.5 }}>
                      <Chip
                        size="small"
                        label={`Next: ${suggestedDifficulty} difficulty`}
                        color={
                          suggestedDifficulty === 'easy'
                            ? 'error'
                            : suggestedDifficulty === 'hard'
                            ? 'success'
                            : 'warning'
                        }
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }

  // ---------- QUIZ STAGE ----------
  if (stage === STAGE.QUIZ) {
    const currentQuestion = questions[currentIndex];
    const progressPercent = ((currentIndex) / questions.length) * 100;

    if (!currentQuestion) {
      return (
        <Alert severity="warning">
          No questions available for this topic right now. Please choose another topic.
        </Alert>
      );
    }

    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            {topic} Quiz
          </Typography>
          <Chip label={currentQuestion.difficulty} size="small" color="primary" variant="outlined" />
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{ mb: 3, height: 8, borderRadius: 5 }}
        />

        <Card>
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Question {currentIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {currentQuestion.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedOption !== null ? String(selectedOption) : ''}
                onChange={(e) => setSelectedOption(Number(e.target.value))}
              >
                {currentQuestion.options.map((opt, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={String(idx)}
                    control={<Radio />}
                    label={opt}
                    sx={{
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      mb: 1.2,
                      mx: 0,
                      py: 0.6,
                      px: 1,
                      ...(selectedOption === idx && {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(76,47,217,0.06)',
                      }),
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                disabled={selectedOption === null}
                onClick={handleNext}
              >
                {currentIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // ---------- RESULT STAGE ----------
  const lastResults = answers;
  const correctCount = lastResults.filter((a) => a.correct).length;
  const total = lastResults.length;
  const percentage = Math.round((correctCount / total) * 100);
  const feedback = getAdaptiveFeedback(percentage);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Quiz Results — {topic}
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h2" fontWeight={700} color="primary.main">
                {percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {correctCount} correct out of {total}
              </Typography>
              <Alert severity={feedback.tone} sx={{ textAlign: 'left', mb: 1 }}>
                <strong>{feedback.message}</strong>
                <br />
                {feedback.recommendation}
              </Alert>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 3, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltRoundedIcon />}
                  onClick={resetQuiz}
                >
                  Choose Another Topic
                </Button>
                <Button variant="contained" onClick={() => startQuiz(topic)}>
                  Retry {topic}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Question Review
              </Typography>
              <List dense>
                {questions.map((q, idx) => {
                  const ans = lastResults[idx];
                  return (
                    <React.Fragment key={q.id}>
                      <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                          {ans?.correct ? (
                            <CheckCircleRoundedIcon color="success" />
                          ) : (
                            <CancelRoundedIcon color="error" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={q.question}
                          secondary={
                            <>
                              <Typography variant="caption" display="block" color="text.secondary">
                                Correct answer: {q.options[q.correctAnswer]}
                              </Typography>
                              <Typography variant="caption" display="block" color="text.secondary">
                                {q.explanation}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {idx < questions.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
