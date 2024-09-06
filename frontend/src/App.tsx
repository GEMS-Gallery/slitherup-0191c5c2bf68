import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

type Player = {
  id: number;
  position: number;
};

type GameState = {
  players: Player[];
  currentPlayerIndex: number;
  winner: number | null;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = async () => {
    setLoading(true);
    try {
      const initialState = await backend.initGame(2);
      setGameState(initialState);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
    setLoading(false);
  };

  const rollDiceAndMove = async () => {
    if (!gameState) return;
    setLoading(true);
    try {
      const roll = await backend.rollDice();
      const newState = await backend.movePlayer(roll);
      setGameState(newState);
    } catch (error) {
      console.error('Error rolling dice and moving:', error);
    }
    setLoading(false);
  };

  const renderBoard = () => {
    const squares = [];
    for (let i = 100; i > 0; i--) {
      const players = gameState?.players.filter(p => p.position === i) || [];
      squares.push(
        <Paper
          key={i}
          elevation={3}
          sx={{
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Typography variant="body2">{i}</Typography>
          {players.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: p.id === 0 ? '#4CAF50' : '#2196F3',
                top: p.id === 0 ? 5 : 35,
                left: p.id === 0 ? 5 : 35,
              }}
            />
          ))}
        </Paper>
      );
    }
    return squares;
  };

  if (!gameState) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" align="center" gutterBottom>
        Snake and Ladders
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid
            container
            spacing={1}
            sx={{
              width: 650,
              height: 650,
              margin: 'auto',
            }}
          >
            {renderBoard()}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Game Info
            </Typography>
            <Typography>
              Current Player: {gameState.currentPlayerIndex + 1}
            </Typography>
            <Typography>
              Player 1 Position: {gameState.players[0].position}
            </Typography>
            <Typography>
              Player 2 Position: {gameState.players[1].position}
            </Typography>
            {gameState.winner !== null && (
              <Typography variant="h5" color="primary">
                Player {gameState.winner + 1} Wins!
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={rollDiceAndMove}
              disabled={loading || gameState.winner !== null}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Roll Dice'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
