# Admin Guide - Managing Game Prompts

## Accessing the Admin Panel

1. While the game is running, go to: **http://localhost:5173/admin**
2. Enter password: `innovate2024`
3. You'll see all 35 seed prompts

## What You Can Do

### View All Prompts

The main page shows every prompt with:
- Type badge (Move, Talk, Create, Wildcard)
- Prompt text
- Enabled/Disabled status

### Filter by Type

Use the dropdown to view only:
- All Types
- Move only
- Talk only
- Create only
- Wildcard only

### Add a New Prompt

1. Scroll to "Add New Prompt" section on the left
2. Select prompt type from dropdown
3. Type your prompt text
4. Click "Add Prompt"
5. It immediately appears in the list
6. Next game will include your new prompt

**Example Prompts to Add:**
- Move: "Do the moonwalk backwards for 10 seconds"
- Talk: "What's a skill you've learned this month?"
- Create: "Design a company mascot in 60 seconds"
- Wildcard: "Everyone must give someone a compliment"

### Edit a Prompt

1. Find the prompt you want to edit
2. Click the "Edit" button
3. Change the type and/or text
4. Click "Save"
5. Changes apply immediately to new games

### Disable Without Deleting

Click the green toggle button to disable a prompt:
- Green = Enabled (will be used)
- Gray = Disabled (will not appear)

This is useful for:
- Retiring seasonal prompts
- Adjusting for audience preferences
- Testing prompts before fully enabling them

### Delete Permanently

Click "Delete" on any prompt to remove it completely. You'll be asked to confirm.

## Prompt Categories Explained

### 🏃 Move Prompts
Physical activities that get people moving. Usually 30-60 seconds.

Examples:
- "Everyone do 10 jumping jacks together"
- "Strike your best superhero pose for 5 seconds"
- "Walk to the front of the room and bow"

### 💬 Talk Prompts
Discussion prompts with no right answer. Let people think and share.

Examples:
- "What skill would surprise your colleagues?"
- "If your team were a famous band, what would you be?"
- "What's the best advice you've ever received?"

### ✏️ Create Prompts
Quick creative tasks. Give people 30-60 seconds.

Examples:
- "Sketch a startup logo for your biggest work frustration"
- "Write a 6-word story about innovation"
- "Name as many uses for a paperclip as you can in 30 seconds"

### 🃏 Wildcard Prompts
Bonus surprises! Team chooses Move, Talk, or Create.

Examples:
- "Your team makes a new rule for the game"
- "Everyone compliment someone from another team"
- "Swap one member with another team for the next turn"

## Tips for Creating Good Prompts

✓ **Be specific** - "Do a silly dance" is better than "Be silly"  
✓ **Set time limits** - "in 30 seconds" makes it feel achievable  
✓ **Be inclusive** - Not everyone wants yoga or physically demanding activities  
✓ **Professional but playful** - Tone matters in a business setting  
✓ **Avoid inside jokes** - Everyone should understand the prompt  
✓ **Test before using** - Try a new prompt with a colleague first  

## During a Game

Your prompt edits apply to **new** games created after you make changes. If a game is already running, it uses the prompts that existed when the game was created.

To use new prompts:
1. Edit/add prompts via admin panel
2. Create a new game session on the host (start fresh)
3. Launch the game with the updated prompts

## Backing Up Prompts

The prompts file is stored at: `server/data/prompts.json`

To backup:
1. Copy this file to a safe location
2. Keep copies for different campaigns/events

To restore:
1. Replace the prompts.json file with your backup
2. Restart the server: Ctrl+C, then `npm run dev`

## Changing Admin Password

The default password is `innovate2024`. To change it:

1. Open `server/index.js`
2. Find the line: `const ADMIN_PASSWORD = 'innovate2024'`
3. Change to your new password
4. Restart the server: Ctrl+C, then `npm run dev`

**Note:** This requires restarting the game, so do this before a live session.

## Troubleshooting

**"Failed to add prompt"**  
→ Make sure you entered prompt text (can't be empty)

**"Changes not showing in game"**  
→ Your changes apply only to NEW games. Start a new game session.

**"Prompts disappeared"**  
→ Check that `server/data/prompts.json` still exists
→ If missing, restart server to regenerate seed prompts

**"Can't access admin panel"**  
→ Make sure server is running: `npm run dev`
→ Check URL: `http://localhost:5173/admin` (not on different port)
→ Check password (default: `innovate2024`)

## Sample Prompts to Get Started

Feel free to import these or create your own:

**Move (10 total needed)**
1. Everyone do 10 jumping jacks
2. Strike your best superhero pose for 5 seconds
3. Do a group wave around the room
4. Everyone spin around once and high-five
5. Do your best impression of a famous athlete for 10 seconds
6. Walk to the front, bow, and walk back
7. Stand on one foot for 15 seconds together
8. Form a human chain and dance
9. Touch floor, reach sky, clap three times
10. Do your best robot dance for 10 seconds

**Talk (10 total needed)**
1. What skill would surprise your colleagues?
2. If your team were a band, what would you be called?
3. Describe your project using only movie titles
4. What's the best advice you've ever received?
5. If you could add one feature to your job, what?
6. What surprised you this week?
7. Time, money, or team—what's your ideal innovation?
8. The best ideas come from...?
9. What was your first job and what did it teach you?
10. If you could work on any project with anyone, what?

**Create (10 total needed)**
1. Sketch a startup logo for your biggest work frustration
2. Write a 6-word story about innovation
3. Name as many uses for a paperclip as possible in 30 seconds
4. Create a rap about your company in 45 seconds
5. Design a new office snack in 60 seconds
6. Invent a new holiday that celebrates your team
7. Create a haiku about teamwork in 60 seconds
8. Design a new emoji that represents your team
9. Write a funny job posting for a role you wish existed
10. Create a new word for the feeling of a great idea

**Wildcard (5 total needed)**
1. Your team makes a new rule for the rest of the game
2. Swap one team member with another team for next round
3. Everyone shout your favorite emoji at once
4. The entire room must do your team's favorite dance move
5. Ask the room any question and everyone must answer

---

That's it! You're now a master of prompt management. 🎮
