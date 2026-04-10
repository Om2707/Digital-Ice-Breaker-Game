# Innovation Center Ice Breaker Board Game MVP

A fully functional, web-based multiplayer board game designed as an ice breaker for innovation workshops. Non-competitive, engaging, and ready for live facilitation.

## 🎮 Features

- **Host Control Dashboard**: Facilitators can control the entire game flow from a dedicated interface
- **Instant Mobile Join**: Participants join via QR code scan with no login required
- **Real-Time Synchronization**: WebSocket-based live updates across all devices
- **30-Space Game Board**: Circular board with color-coded space types
- **4 Prompt Categories**: Move (physical), Talk (discussion), Create (creative), Wildcard (choice)
- **Admin Panel**: Manage and customize prompts without code changes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Scoring**: Focuses on energy and engagement, not competition

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Internet connection** for local network play

## 🚀 Quick Start

### Option A: Standard npm (Recommended for Development)

#### 1. One-Time Firewall Setup (Windows Only)
```powershell
# Run PowerShell as Administrator
.\setup-firewall.ps1
```

#### 2. Install Dependencies
```bash
npm run install-all
```

#### 3. Start Development Server
```bash
npm run dev
```

**Your game is running:**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Option B: Docker (Best for Production Testing)

No firewall configuration needed!

```bash
# Option 1: Using npm script
npm run dev-docker

# Option 2: Manual Docker command
docker-compose up --build

# Stop with:
npm run dev-stop
# Or: docker-compose down
```

---

### 4. Open in Browser

- **Host View**: http://localhost:5173/host
- **Admin Panel**: http://localhost:5173/admin (Password: `innovate2024`)

## 🎯 How to Run a Live Game

### Step 1: Host Preparation
1. Open the host view on a shared screen (projector/TV)
2. Create a new game session:
   - Enter desired number of teams (2-6)
   - Set team names (optional, defaults provided)
   - Click "Create Game Session"

### Step 2: Player Join
1. Display the QR code on the shared screen
2. Participants scan with mobile device to open join form
3. Players enter their name and select/confirm team name
4. Players see "Joined Successfully" confirmation

### Step 3: Run the Game
1. Host clicks "Start Game"
2. Turn indicator shows active team
3. Active team's captain clicks "Roll Dice" on their device
4. Dice animation plays, token moves on board
5. Prompt card displays activity for that team
6. Team completes activity in the room (takes ~30-60 seconds)
7. Host clicks "Next Turn"
8. Repeat until ready to transition to ideation

### Step 4: End Game
- Host clicks "End Game"
- Displays "You're ready to ideate!" message
- Facilitates transition into ideation workshop

**Typical Session Duration**: 10-15 minutes for 3-4 teams

## 📱 Participant Experience

Participants do NOT need:
- To create accounts
- To install an app
- To be tech-savvy
- To understand the mechanics

They DO get:
- Instant access via QR code
- Clear instructions and large text
- Real-time participation
- Shared energy and engagement

## 🔧 Admin Panel - Prompt Management

### Access Admin Panel
- **URL**: http://localhost:5173/admin
- **Password**: `innovate2024`

### Capabilities
- **View all prompts** with type filtering
- **Add new prompts**: Choose type, enter text
- **Edit existing prompts**: Modify text and type inline
- **Enable/Disable**: Toggle prompts on/off without deleting
- **Delete prompts**: Remove entries entirely

### Prompt Types
- **🏃 Move**: Light physical activities (30-60 seconds)
- **💬 Talk**: Discussion prompts (no right answers)
- **✏️ Create**: Fast creative tasks (30-60 seconds)
- **🃏 Wildcard**: Team chooses from all three types

### Seeded Prompts
The app comes with 35 pre-loaded prompts:
- 10 Move prompts
- 10 Talk prompts
- 10 Create prompts
- 5 Wildcard prompts

All prompts are professional, playful, and appropriate for innovation settings.

## 🏗️ Project Structure

```
/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Main views (Host, Join, Player, Admin)
│   │   ├── components/    # Reusable components (Board, Cards, etc)
│   │   ├── socket.js      # WebSocket client configuration
│   │   ├── App.jsx        # Router and layout
│   │   └── index.css      # Tailwind + custom animations
│   ├── index.html         # Entry point
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── package.json       # Client dependencies
│
├── server/                # Node/Express + Socket.IO backend
│   ├── index.js           # Express + Socket.IO setup
│   ├── gameManager.js     # Game state and logic
│   ├── promptManager.js   # Prompt loading and tracking
│   ├── data/
│   │   └── prompts.json   # Persistent prompt storage
│   └── package.json       # Server dependencies
│
├── .env.example           # Environment variables template
├── Dockerfile             # Docker build configuration
├── docker-compose.yml     # Multi-container setup
├── package.json           # Root orchestration scripts
└── README.md              # This file
```

## 🔌 Real-Time Synchronization (Socket.IO)

The game uses WebSockets for instant synchronization across all connected devices:

### Key Events

**Client → Server:**
- `create_session`: Start a new game session
- `join_session`: Player joins a team
- `start_game`: Host initiates gameplay
- `roll_dice`: Captain rolls the dice
- `wildcard_choice`: Captain selects option on wildcard space
- `end_turn`: Advance to next team's turn
- `end_game`: Conclude the game session

**Server → Clients:**
- `session_updated`: Full game state broadcast
- `dice_rolled`: Dice result with animation trigger
- `token_moved`: Token position update for board animation
- `prompt_revealed`: New prompt card for current team
- `game_ended`: Game conclusion notification

## 🎨 UI/UX Details

### Design Philosophy
- **Modern** but not childish
- **High contrast** for readability from 10+ feet away
- **Smooth animations** for engagement
- **Touch-friendly** on mobile devices
- **Responsive** from 320px mobile to 4K displays

### Color Palette
- **Background**: Deep navy (#0f172a)
- **Move Spaces**: Blue (#3b82f6)
- **Talk Spaces**: Yellow (#eab308)
- **Create Spaces**: Green (#22c55e)
- **Wildcard Spaces**: Gray (#6b7280)
- **Active Team**: Golden glow (#fbbf24)

### Typography
- **Large headers**: 32px
- **Prompt text**: 24px+ (readable from across room)
- **Body text**: 16px (mobile-optimized)
- **UI labels**: 14px

## 📊 Board Mechanics

### Board Layout
- **Total Spaces**: 30 (arranged in a circle)
- **Distribution**:
  - 8 Move spaces (blue)
  - 9 Talk spaces (yellow)
  - 8 Create spaces (green)
  - 5 Wildcard spaces (gray)

### Gameplay Loop
1. **Turn Starts**: Active team highlighted with golden glow
2. **Rolling**: Captain taps "Roll Dice" on mobile
3. **Animation**: Dice rolls (0.6s), token animates (1s)
4. **Prompt**: Card flips to reveal activity (0.8s animation)
5. **Activity**: Team completes task (30-60 seconds)
6. **Advancement**: Host clicks "Next Turn" after completion
7. **Rotation**: Automatically cycles through teams

### Wildcard Mechanics
When a team lands on a Wildcard space:
- Prompt card shows 3 option buttons: Move, Talk, Create
- Team captain selects their preferred activity
- Selected prompt immediately loads
- Encourages strategic decision-making

## 🌐 Deployment

### Local Development (Recommended for Testing)

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: (optional) Run tests
npm test
```

Then visit: http://localhost:5173

### Docker Deployment

```bash
# Build and start containers
docker-compose up --build

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

### AWS Deployment - EC2

#### Step 1: Launch EC2 Instance
```bash
# Launch t3.micro or t3.small Ubuntu 20.04 LTS
# Allow inbound rules: 80, 443, 3001, 5173
```

#### Step 2: SSH and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo-url>
cd innovation-board-game

# Install dependencies
npm install-all

# Start with PM2 (process manager)
sudo npm install -g pm2
pm2 start server/index.js --name "board-game-server"
pm2 start "npm run client" --name "board-game-client"
pm2 startup
pm2 save
```

#### Step 3: Configure Reverse Proxy (Optional)
Use Nginx to serve frontend and proxy API:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3001;
    }

    location /socket.io {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### AWS Deployment - Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize
eb init -p "Node.js 18 running on 64bit Amazon Linux 2"

# Complete dockerfile and .ebextensions if needed
# Deploy
eb create production
eb deploy
```

## 🔐 Security & Best Practices

### Security Implementations (Built-In)

This application includes several security hardening measures:

#### 1. **Admin Authentication**
- Admin password is loaded from environment variable (`VITE_ADMIN_PASSWORD`)
- Uses timing-safe comparison to prevent timing attacks
- Password can be customized per deployment via `.env.local`

#### 2. **Secure Random Generation**
- Session codes use `crypto.randomBytes()` (not `Math.random()`)
- Board shuffling uses cryptographically secure randomization
- Prompt selection uses secure random number generation
- Prevents predictability attacks on game state

#### 3. **Container Security (Docker)**
- Dockerfile runs application as non-root user (nodejs, UID 1001)
- Prevents privilege escalation attacks
- Alpine Linux base reduces attack surface

#### 4. **CORS Protection**
- Cross-Origin requests restricted to allowlist of known origins
- Default allowlist: localhost:5173, localhost:3001, 127.0.0.1 (both ports)
- Can be extended via `ALLOWED_ORIGINS` environment variable
- Prevents cross-site attacks from untrusted domains

#### 5. **API Input Validation**
- Prompt ID validation before constructing API calls
- Prevents Server-Side Request Forgery (SSRF) attacks
- All user inputs sanitized before processing

#### 6. **Transport Security**
- TLS verification enabled in production mode
- Socket.IO secure option conditional on environment
- Prevents man-in-the-middle attacks

### Environment Variables (Configuration)

Create a `.env.local` file in project root with:

```bash
# Admin panel password (frontend)
VITE_ADMIN_PASSWORD=your_secure_password_here

# CORS allowed origins (backend) - comma-separated
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Production Deployment Checklist
- ✅ Change admin password from default (`innovate2024`)
- ✅ Use environment variables for all secrets (hardcoded passwords removed)
- ✅ Enable HTTPS/SSL certificates on production servers
- ✅ Set secure Socket.IO transport settings
- ✅ Configure CORS allowlist for your domain
- ✅ Run Docker containers as non-root user (built-in)
- ✅ Validate all user inputs before API calls (built-in)
- ⚠️ Add rate limiting to API endpoints (recommended)
- ⚠️ Add CSP headers via reverse proxy (recommended)

### Current Defaults for Development
- Admin password: `innovate2024` (change in production!)
- CORS allowlist: localhost and 127.0.0.1 (localhost development)
- No database authentication (JSON file storage - MVP scope)
- No user accounts or login system (intentional - facilitator-controlled)
- Local network assumed (corporate WiFi environment)

## 🐛 Known Limitations & Assumptions

### Limitations
1. **Single Server Instance**: Not load-balanced (suitable for single facilitator)
2. **Memory-Based Sessions**: Sessions lost on server restart
3. **JSON File Storage**: No database (suitable for MVP, 30-50 sessions max)
4. **No Mobile App**: Web-only (no iOS/Android native apps)
5. **No Analytics**: No usage tracking or metrics
6. **No Scoring System**: Intentionally non-competitive

### Assumptions
1. **LAN/WiFi**: Assumes corporate WiFi or LAN deployment
2. **Mobile Phones**: Participants have personal devices or company laptops
3. **Facilitator Technical**: Host is comfortable with basic tech
4. **30-40 Min Max**: Not designed for extended play sessions
5. **Cultural Context**: Playful tone suitable for innovation workshops

## 📞 Support & Troubleshooting

### Issue: Players can't scan QR code
**Solution**: Ensure QR code is clearly visible, well-lit, and participants have camera access

### Issue: Players see "Session not found"
**Solution**: Verify session ID is correct, server is running, and players are on same network

### Issue: Mobile device won't connect after scanning QR
**⚡ SOLUTIONS (in order of ease):**

1. **Use Docker (Recommended - No Firewall Issues)**
   ```bash
   npm run dev-docker
   ```
   Docker containers bypass Windows Firewall automatically. Mobile devices connect seamlessly.

2. **Disable Permissions for npm dev (Windows Only)**
   - Run PowerShell as Administrator
   - Execute the included firewall script:
     ```powershell
     .\setup-firewall.ps1
     ```
   - This configures Windows Firewall to allow ports 3001 and 5173
   - Then run `npm run dev` as usual
   - Mobile devices should now connect without issues

3. **Verify Network Connection**
   - Ensure phone and computer are on **SAME WiFi** network
   - Disable VPN on phone if connected
   - Check that QR code shows correct IP (not localhost)
   - Try connecting to `http://192.168.x.x:5173/join/{SESSION_ID}` directly

### Issue: Prompts repeat
**Solution**: Admin can disable/enable prompts, or add new ones via admin panel

### Issue: Network lag/delays
**Solution**: Check WiFi signal, reduce number of teams, close unnecessary applications

---

## 🐳 Docker vs npm dev

| Feature | Docker | npm dev |
|---------|--------|---------|
| **Firewall Issues** | ❌ None | ⚠️ May need setup-firewall.ps1 |
| **Setup Time** | 2 minutes | 1 minute |
| **Mobile Connection** | ✅ Seamless | ✅ After firewall config |
| **Requires Docker Desktop** | ✅ Yes | ❌ No |
| **Best For** | Production-like testing | Quick development |

---

## 📝 Development Notes

### Code Structure
- **No external CSS frameworks** except Tailwind
- **No build tool complexity** (Vite is simple)
- **Modular components** for reusability
- **Socket.IO for real-time sync** (no polling)
- **Simple state management** (component state + sockets)

### Adding New Features
1. Add socket listener in relevant component
2. Emit event from client
3. Handle event in server (`index.js`)
4. Update game state in `gameManager.js`
5. Broadcast update to all clients

### Modifying Prompts
Edit `/server/data/prompts.json` or use admin panel (recommended)

### Customizing Board
Adjust space distribution in `gameManager.js` `createBoard()` method

## 📦 Build & Deployment Checklist

- [ ] All dependencies installed (`npm install-all`)
- [ ] Local build successful (`npm run dev`)
- [ ] Admin panel accessible and functional
- [ ] Host can create session and generate QR
- [ ] Players can scan and join
- [ ] Dice rolls and tokens animate
- [ ] Prompts load correctly
- [ ] No console errors
- [ ] Responsive on mobile (test with DevTools)
- [ ] `.env` file configured for production
- [ ] Docker build successful (if deploying)
- [ ] Server logs clean on startup

## 🎓 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.0 |
| **Styling** | Tailwind CSS | 3.3.6 |
| **Real-Time** | Socket.IO | 4.7.2 |
| **Backend Framework** | Express.js | 4.18.2 |
| **Runtime** | Node.js | 18+ |
| **Data Storage** | JSON (lowdb ready) | File-based |
| **QR Codes** | qrcode.react | 1.0.1 |
| **HTTP Client** | Axios | 1.6.0 |

## 📄 License

MIT - Free to use, modify, and distribute

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- Persistent database (PostgreSQL, MongoDB)
- Advanced analytics dashboard
- Customizable themes
- Multi-language support
- Mobile app variants
- AI-generated prompts

---

**Built with ❤️ for innovation teams**  
*Ready to energize your next customer workshop*
