# QUICK START GUIDE

## 🚀 Choose Your Setup Method

### Option 1: Standard npm dev (⭐ RECOMMENDED - Reliable for WiFi + Mobile)

Works reliably for desktop + mobile on same WiFi network:

#### Step 1: Configure Windows Firewall (One-Time Setup)
```powershell
# Run PowerShell as Administrator, then:
.\setup-firewall.ps1
```
This allows mobile devices to connect without firewall blocking.

#### Step 2: Install & Run
```bash
# Install all dependencies
npm run install-all

# Start the development server
npm run dev
```

**That's it!** Your game is now running:
- 🎮 Frontend: http://localhost:5173
- 🖥️ Backend: http://localhost:3001
- ✅ **Mobile devices can scan QR and join!**

---

### Option 2: Docker (Advanced - Production Testing)

For production-like environment testing:

```bash
# Start with Docker Compose
npm run dev-docker

# Stop with
npm run dev-stop
```

**Note:** Docker is best for production deployment, not development with mobile devices on WiFi.

---

## 📱 First Game in 5 Minutes

### On Desktop (Host Computer)
1. Open http://localhost:5173/host in a browser
2. Set number of teams (try 3)
3. Click "Create Game Session"
4. Display the QR code on a screen

### On Mobile (Participant Device)
1. **Must be on same WiFi network as desktop**
2. Open camera and scan QR code
3. Wait for join form to load (should appear within 4 seconds)
4. Enter your name
5. Select a team
6. Click "Join Game"

### Back on Desktop
1. Click "Start Game"
2. Active team captain on mobile clicks "Roll Dice"
3. Watch the animation and see the prompt
4. Read the prompt aloud and do the activity
5. Click "Next Turn"
6. Repeat!

---

## 🔧 Admin Panel Access

1. Go to: http://localhost:5173/admin
2. Password: `innovate2024`
3. Add/Edit/Delete prompts

---

## ⚠️ Troubleshooting

### "Mobile can't scan QR" or "Connection refused"
1. **Ensure phone and computer are on SAME WiFi network**
2. **If using npm dev:** Run the firewall setup script first:
   ```powershell
   .\setup-firewall.ps1
   ```
3. **Or use Docker instead** (no firewall issues)

### "QR code doesn't load"
- Make sure you have internet access
- The QR code should show your computer's network IP (e.g., 192.168.x.x)

### Docker Issues
- Make sure Docker Desktop is running
- Try `docker-compose down` then `docker-compose up --build` again
4. Changes are instant and persistent

---

## 🐛 Troubleshooting

### Ports Already In Use?
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Same for port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Dependencies Not Installing?
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules
npm install-all
```

### Prompts Not Loading?
Check `/server/data/prompts.json` exists. If not:
1. Wait 2 seconds for server to initialize
2. Restart: `npm run dev`
3. Check console for errors

### Mobile WiFi Connection?
- Both computer and phone must be on same network
- Replace `localhost` with computer IP in URL
- Example: `http://192.168.1.100:5173/join/SPARK42`

---

## 📊 Project Statistics

- **Total Files**: 25
- **Lines of Code**: ~3,500
- **React Components**: 6
- **Server Routes**: 5
- **Socket Events**: 12
- **Seed Prompts**: 35

---

## ✅ Verification Checklist

After `npm run dev`, verify:

- [ ] No console errors
- [ ] Host page loads at localhost:5173
- [ ] QR code displays correctly
- [ ] Admin panel accessible (password: innovate2024)
- [ ] Network requests show in DevTools
- [ ] WebSocket connection established (/socket.io)

---

## 🎮 Game Flow Diagram

```
Host Screen                Participant Mobile
────────────────────      ──────────────────

Create Session ──────┐
Display QR Code      │
                 └──> Scan QR
                      Enter Name
                      Join Team
                          │
Start Game <──────────────┘
Highlight Team
Show First Prompt
                         Captain Sees
                         "Roll Dice"
                         Button
                             │
Next Turn <─── Captain Rolls ─┘
Wait for Players
                      Team Does Activity
                      (Physical, Discussion,
                       Creative, etc.)
                             │
                      Ready Signal
                       (Host clicks)
                             │
Move to Next Team ──────────>
                      Update Board View

(Repeat until 10-15 min)

End Game ──────────────> "Ready to Ideate!" ✨
```

---

## 🌐 Network Modes

### Mode 1: Local Testing (Default)
- Host and participants on same computer
- Use: `http://localhost:5173`
- Best for: Initial testing, demos

### Mode 2: LAN (Corporate Network)
- All devices on same WiFi/network
- Replace `localhost` with host IP
- Use: `http://192.168.1.100:5173`
- Best for: Actual workshops

### Mode 3: Public Internet (Advanced)
- Requires public domain and SSL
- Use reverse proxy (Nginx)
- Modify VITE_API_URL environment variable
- Best for: Remote innovation sessions

---

## 📚 Key Component Files

| File | Purpose |
|------|---------|
| `client/src/pages/HostPage.jsx` | Facilitator control dashboard |
| `client/src/pages/PlayerPage.jsx` | Mobile participant view |
| `client/src/pages/JoinPage.jsx` | QR code join flow |
| `client/src/pages/AdminPage.jsx` | Prompt management |
| `client/src/components/GameBoard.jsx` | Circular board visualization |
| `client/src/components/PromptCard.jsx` | Animated prompt display |
| `server/gameManager.js` | Game state logic |
| `server/promptManager.js` | Prompt persistence |
| `server/index.js` | Express + Socket.IO |

---

## 🚀 Next Steps After MVP

1. **Database**: Replace JSON with PostgreSQL
2. **Analytics**: Track sessions, prompts used, team engagement
3. **Custom Branding**: Add company logos and color themes
4. **Mobile Apps**: React Native or Flutter
5. **Scoring**: Optional point systems
6. **AI Prompts**: Dynamic prompt generation

---

**Ready to energize your innovation session?** 🎉
