import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { randomBytes } from 'crypto';

class PromptManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.prompts = [];
    this.sessionUsedPrompts = {}; // Track used prompts per session
    this.initialize();
  }

  async initialize() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.prompts = JSON.parse(data);
    } catch (error) {
      console.log('Creating new prompts file...');
      await this.seedPrompts();
    }
  }

  async seedPrompts() {
    const seedData = [
      // MOVE (10 prompts)
      {
        id: uuidv4(),
        type: 'move',
        text: 'Everyone stand up and do 10 jumping jacks together. Ready? Go!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Strike your best superhero pose and hold it for 5 seconds. Channel your inner power!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Do a group wave around the room — start left, end right. Make it smooth!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Everyone spin around once, then give each other a high-five.',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Do your best impression of a famous athlete or superhero for 10 seconds.',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Walk to the front of the room, bow, and walk back. Own it!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Everyone stand on one foot for 15 seconds while cheering for each other.',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Form a human chain and do a synchronized dance move. Whatever feels right!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Everyone touch the floor, reach for the sky, and clap. Repeat three times!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'move',
        text: 'Do your best robot dance for 10 seconds. Beep boop!',
        enabled: true,
      },

      // TALK (10 prompts)
      {
        id: uuidv4(),
        type: 'talk',
        text: 'What skill do you have that would surprise your colleagues?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'If your team were a famous band, what would you be called and why?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'Describe your current project using only movie titles. Go!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'What\'s the best advice you\'ve ever received, and who gave it to you?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'If you could add one feature to your job, what would it be?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'What\'s something you learned this week that surprised you?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'What\'s your ideal innovation: time, money, or team? Why?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'Finish this sentence: "The best ideas come from..."',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'What was your first job, and what did it teach you?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'talk',
        text: 'If you could work on any project with anyone, what would it be?',
        enabled: true,
      },

      // CREATE (10 prompts)
      {
        id: uuidv4(),
        type: 'create',
        text: 'Sketch the logo for a startup that solves your biggest work frustration. You have 60 seconds!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Write a 6-word story about innovation. Make it memorable!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'In 30 seconds, name as many uses for a paperclip as possible. Go!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Create a rap or poetry about your company in 45 seconds. No rhyming required!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Design a new office snack in 60 seconds. What\'s it called? What does it taste like?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Invent a new holiday that celebrates your team. What\'s it called? How do you celebrate?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Create a haiku about teamwork using only one-syllable words. You have 60 seconds.',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Design a new emoji that represents your team\'s vibe. Draw or describe it!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Write a job posting for the role you wish existed. Make it funny!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'create',
        text: 'Create a new word that describes the feeling of a great idea. What\'s it called?',
        enabled: true,
      },

      // WILDCARD (5 prompts)
      {
        id: uuidv4(),
        type: 'wildcard',
        text: 'Your team gets to make up a new rule for the rest of the game. What is it?',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'wildcard',
        text: 'Swap one team member with another team for the next round. Choose wisely!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'wildcard',
        text: 'Everyone shout out their favorite emoji at the same time!',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'wildcard',
        text: 'The entire room must do your team\'s favorite dance move together.',
        enabled: true,
      },
      {
        id: uuidv4(),
        type: 'wildcard',
        text: 'Your team gets to ask the room any question and everyone must answer honestly.',
        enabled: true,
      },
    ];

    this.prompts = seedData;
    await this.savePrompts();
  }

  async savePrompts() {
    try {
      const dir = dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.filePath, JSON.stringify(this.prompts, null, 2));
    } catch (error) {
      console.error('Error saving prompts:', error);
    }
  }

  getAllPrompts() {
    return this.prompts;
  }

  getPromptById(id) {
    return this.prompts.find((p) => p.id === id);
  }

  getEnabledPrompts(type = null) {
    if (type) {
      return this.prompts.filter((p) => p.enabled && p.type === type);
    }
    return this.prompts.filter((p) => p.enabled);
  }

  /**
   * Get the next prompt for a session, avoiding repeats within a game
   */
  getNextPrompt(sessionId, type) {
    if (!this.sessionUsedPrompts[sessionId]) {
      this.sessionUsedPrompts[sessionId] = [];
    }

    const enabledPrompts = this.getEnabledPrompts(type);
    const availablePrompts = enabledPrompts.filter(
      (p) => !this.sessionUsedPrompts[sessionId].includes(p.id)
    );

    if (availablePrompts.length === 0) {
      // Reset and reshuffle using cryptographically secure random
      this.sessionUsedPrompts[sessionId] = [];
      const randomByte = randomBytes(1)[0];
      return enabledPrompts[randomByte % enabledPrompts.length];
    }

    const randomByte = randomBytes(1)[0];
    const prompt = availablePrompts[randomByte % availablePrompts.length];
    this.sessionUsedPrompts[sessionId].push(prompt.id);
    return prompt;
  }

  addPrompt(text, type) {
    const newPrompt = {
      id: uuidv4(),
      type,
      text,
      enabled: true,
    };
    this.prompts.push(newPrompt);
    this.savePrompts();
    return newPrompt;
  }

  updatePrompt(id, updates) {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.prompts[index] = { ...this.prompts[index], ...updates };
    this.savePrompts();
    return this.prompts[index];
  }

  deletePrompt(id) {
    const index = this.prompts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.prompts.splice(index, 1);
    this.savePrompts();
    return true;
  }

  clearSessionPrompts(sessionId) {
    delete this.sessionUsedPrompts[sessionId];
  }
}

export default PromptManager;
