import { v4 as uuidv4 } from 'uuid';
import { randomBytes } from 'crypto';

class GameManager {
  constructor() {
    this.sessions = {};
  }

  /**
   * Creates a new game session
   */
  createSession(teamCount, teamNames = []) {
    const sessionId = this.generateSessionCode();
    const teams = this.initializeTeams(teamCount, teamNames);
    const board = this.createBoard();

    const session = {
      sessionId,
      status: 'waiting', // waiting, active, ended
      teams,
      currentTeamIndex: 0,
      currentPrompt: null,
      usedPromptIds: [],
      round: 0,
      board,
      createdAt: new Date(),
    };

    this.sessions[sessionId] = session;
    return session;
  }

  /**
   * Gets a session by ID
   */
  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  /**
   * Starts the game
   */
  startGame(sessionId) {
    const session = this.sessions[sessionId];
    if (session) {
      session.status = 'active';
      session.round = 1;
    }
    return session;
  }

  /**
   * Advances to the next team's turn
   */
  advanceTurn(sessionId) {
    const session = this.sessions[sessionId];
    if (session && session.status === 'active') {
      session.currentTeamIndex = (session.currentTeamIndex + 1) % session.teams.length;
      if (session.currentTeamIndex === 0) {
        session.round += 1;
      }
    }
    return session;
  }

  /**
   * Ends the game
   */
  endGame(sessionId) {
    const session = this.sessions[sessionId];
    if (session) {
      session.status = 'ended';
    }
    return session;
  }

  /**
   * Generates a unique session code (e.g., "SPARK42") using cryptographically secure random
   */
  generateSessionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(bytes[i] % chars.length);
    }
    return code;
  }

  /**
   * Initializes teams for the session
   */
  initializeTeams(count, teamNames = []) {
    const defaultNames = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
    const teams = [];

    for (let i = 0; i < count; i++) {
      teams.push({
        id: uuidv4(),
        name: teamNames[i] || defaultNames[i] || `Team ${i + 1}`,
        position: 0,
        isActive: i === 0,
        captainSocketId: null,
        players: [],
      });
    }

    return teams;
  }

  /**
   * Creates the game board with 30 spaces
   * Distribution: 8 Move, 9 Talk, 8 Create, 5 Wildcard
   */
  createBoard() {
    const types = [
      ...Array(8).fill('move'),
      ...Array(9).fill('talk'),
      ...Array(8).fill('create'),
      ...Array(5).fill('wildcard'),
    ];

    // Shuffle array using Fisher-Yates with crypto.randomBytes
    for (let i = types.length - 1; i > 0; i--) {
      const bytes = randomBytes(1);
      const j = bytes[0] % (i + 1);
      [types[i], types[j]] = [types[j], types[i]];
    }

    return types.map((type, index) => ({
      id: index,
      type,
      position: index,
    }));
  }
}

export default GameManager;
