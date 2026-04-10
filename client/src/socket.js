import io from 'socket.io-client';

// Determine the backend URL - use environment variable first, then auto-detect
let SOCKET_URL = import.meta.env.VITE_API_URL;

if (!SOCKET_URL) {
  // Get the hostname (handles both localhost and network IP)
  const hostname = window.location.hostname;
  const port = 3001;
  SOCKET_URL = `http://${hostname}:${port}`;
}

console.log('[SOCKET] Connecting to:', SOCKET_URL);
console.log('[SOCKET] Current hostname:', window.location.hostname);
console.log('[SOCKET] Current origin:', window.location.origin);

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: Infinity,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  forceNew: false,
  upgrade: true,
  rememberUpgrade: false,
  // Timeout settings for slow networks
  connectTimeout: 20000,
  // Enable secure TLS verification in production
  secure: import.meta.env.PROD, // true in production, false in dev
});

socket.on('connect', () => {
  console.log('[SOCKET] Connected successfully', {
    id: socket.id,
    transport: socket.io.engine.transport.name,
  });
});

socket.on('connect_error', (error) => {
  console.error('[SOCKET] Connection error:', {
    message: error.message,
    type: error.type,
    code: error.code,
  });
});

socket.on('disconnect', (reason) => {
  console.log('[SOCKET] Disconnected:', reason);
});

socket.on('error', (error) => {
  console.error('[SOCKET] Socket error:', error);
});

socket.io.engine.on('upgrade', (transport) => {
  console.log('[SOCKET] Transport upgraded to:', transport.name);
});

socket.io.engine.on('upgrade_error', () => {
  console.log('[SOCKET] Transport upgrade failed, using fallback');
});

export default socket;
