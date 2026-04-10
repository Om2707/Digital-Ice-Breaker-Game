import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';
import GameManager from './gameManager.js';
import PromptManager from './promptManager.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3001',
  // Add network IPs if needed in production
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowEIO3: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Middleware
app.use(cors());
app.use(express.json());

// Initialize managers
const gameManager = new GameManager();
const promptManager = new PromptManager(join(__dirname, 'data', 'prompts.json'));

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/diagnostics', (req, res) => {
  const diagnostics = {
    server: {
      status: 'ok',
      port: PORT,
      host: HOST,
      timestamp: new Date().toISOString(),
    },
    network: {
      clientIp: req.ip || req.connection.remoteAddress,
      clientPort: req.connection.remotePort,
      serverHost: req.hostname,
      protocol: req.protocol,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      socketIOStatus: 'ready',
    },
    serverIp: getLocalIP(),
  };
  res.json(diagnostics);
});

app.get('/api/server-ip', (req, res) => {
  const ip = getLocalIP();
  res.json({ ip, port: 5173, joinUrl: `http://${ip}:5173` });
});

app.get('/api/prompts', (req, res) => {
  const prompts = promptManager.getAllPrompts();
  res.json(prompts);
});

app.post('/api/prompts', (req, res) => {
  const { text, type } = req.body;
  if (!text || !type) {
    return res.status(400).json({ error: 'Missing text or type' });
  }
  const newPrompt = promptManager.addPrompt(text, type);
  res.status(201).json(newPrompt);
});

app.put('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  const { text, type, enabled } = req.body;
  const updated = promptManager.updatePrompt(id, { text, type, enabled });
  if (!updated) {
    return res.status(404).json({ error: 'Prompt not found' });
  }
  res.json(updated);
});

app.delete('/api/prompts/:id', (req, res) => {
  const { id } = req.params;
  const deleted = promptManager.deletePrompt(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Prompt not found' });
  }
  res.json({ success: true });
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`, {
    address: socket.handshake.address,
  });

  socket.on('create_session', (data) => {
    const { teamCount, teamNames } = data;
    const session = gameManager.createSession(teamCount, teamNames || []);
    socket.join(session.sessionId);
    socket.emit('session_created', session);
    io.to(session.sessionId).emit('session_updated', session);
  });

  socket.on('join_session', (data) => {
    const { sessionId, teamName, playerName } = data;
    const session = gameManager.getSession(sessionId);
    
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.teamName = teamName;
    socket.playerName = playerName;

    // Mark first player as captain if team is empty
    const team = session.teams.find((t) => t.name === teamName);
    if (team && !team.captainSocketId) {
      team.captainSocketId = socket.id;
      team.players = team.players || [];
      team.players.push({ name: playerName, isCapitan: true });
    } else if (team) {
      team.players = team.players || [];
      team.players.push({ name: playerName, isCapitan: false });
    }

    io.to(sessionId).emit('session_updated', session);
  });

  socket.on('start_game', (data) => {
    const { sessionId } = data;
    const session = gameManager.startGame(sessionId);
    if (session) {
      const prompt = promptManager.getNextPrompt(sessionId, session.board[0].type);
      session.currentPrompt = prompt;
      io.to(sessionId).emit('game_started', session);
      io.to(sessionId).emit('session_updated', session);
    }
  });

  socket.on('roll_dice', (data) => {
    const { sessionId } = data;
    const session = gameManager.getSession(sessionId);
    
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    const activeTeam = session.teams[session.currentTeamIndex];
    if (activeTeam.captainSocketId !== socket.id) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    const diceValue = Math.floor(Math.random() * 6) + 1;
    io.to(sessionId).emit('dice_rolled', { value: diceValue, teamId: activeTeam.id });

    // Move token
    const newPosition = (activeTeam.position + diceValue) % session.board.length;
    activeTeam.position = newPosition;
    const spaceType = session.board[newPosition].type;

    io.to(sessionId).emit('token_moved', {
      teamId: activeTeam.id,
      newPosition,
      spaceType,
    });

    // Get prompt based on space type
    let prompt;
    if (spaceType === 'wildcard') {
      // For wildcard, send all three options
      prompt = {
        type: 'wildcard',
        text: 'Choose your adventure:',
        options: [
          promptManager.getNextPrompt(sessionId, 'move'),
          promptManager.getNextPrompt(sessionId, 'talk'),
          promptManager.getNextPrompt(sessionId, 'create'),
        ],
      };
    } else {
      prompt = promptManager.getNextPrompt(sessionId, spaceType);
    }

    session.currentPrompt = prompt;
    io.to(sessionId).emit('prompt_revealed', prompt);
  });

  socket.on('wildcard_choice', (data) => {
    const { sessionId, selectedType } = data;
    const session = gameManager.getSession(sessionId);
    
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    const prompt = promptManager.getNextPrompt(sessionId, selectedType);
    session.currentPrompt = prompt;
    io.to(sessionId).emit('prompt_revealed', prompt);
  });

  socket.on('end_turn', (data) => {
    const { sessionId } = data;
    const session = gameManager.advanceTurn(sessionId);
    
    if (session) {
      const activeTeam = session.teams[session.currentTeamIndex];
      io.to(sessionId).emit('session_updated', session);
      io.to(sessionId).emit('turn_advanced', {
        currentTeamIndex: session.currentTeamIndex,
        activeTeam: {
          id: activeTeam.id,
          name: activeTeam.name,
        },
      });
    }
  });

  socket.on('end_game', (data) => {
    const { sessionId } = data;
    const session = gameManager.endGame(sessionId);
    
    if (session) {
      io.to(sessionId).emit('game_ended', {
        message: "You're ready to ideate!",
        finalState: session,
      });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`[SOCKET] Client disconnected: ${socket.id}`, { reason });
  });

  socket.on('error', (error) => {
    console.error(`[SOCKET] Socket error for ${socket.id}:`, error);
  });
});

io.engine.on('connection_error', (err) => {
  console.error('[SOCKET-ENGINE] Connection error:', err);
});

// Start server
const PORT = process.env.SERVER_PORT || 3001;
const HOST = process.env.SERVER_HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  const protocol = 'http';
  const localhostUrl = `${protocol}://localhost:${PORT}`;
  const networkMessage = HOST === '0.0.0.0' 
    ? `\n  Network: http://${os.networkInterfaces().eth0?.[0]?.address || 'YOUR_IP'}:${PORT}` 
    : '';
  
  console.log(`[SERVER] Running on ${localhostUrl}${networkMessage}`);
  console.log(`[SERVER] Host: ${HOST}`);
  console.log(`[SERVER] Port: ${PORT}`);
  console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
