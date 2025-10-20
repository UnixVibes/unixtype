# UnixType

**Professional Typing Performance Platform**

UnixType is an enterprise-grade typing performance measurement and analytics platform designed for professionals who demand precision. Built with Next.js and featuring a modern teal color scheme.

## Features

- **Typing Performance Measurement**: Accurate WPM, accuracy, and consistency tracking
- **Multiple Test Modes**: Time-based (15s, 30s, 60s, 120s) and word-based (10, 25, 50, 100 words) testing
- **Local Leaderboard System**: Track and compare your performance against previous sessions
- **Real-time Feedback**: Live WPM tracking and character-by-character validation
- **Professional UI**: Clean, distraction-free interface with teal color theme
- **Persistent Storage**: All scores stored locally using localStorage
- **Responsive Design**: Works seamlessly across all device sizes

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Local Storage**: Client-side data persistence

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to start typing!

## How to Use

1. **Select Mode**: Choose between time-based or word-based testing
2. **Configure Test**: Select your preferred duration or word count
3. **Start Typing**: Click the input field and start typing the displayed words
4. **View Results**: After completing the test, enter your name to save your score
5. **Check Leaderboard**: See how you rank against your previous attempts

## Project Structure

```
unixtype-nextjs/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── TypingTest.tsx    # Main typing test component
│   └── ResultScreen.tsx  # Results and leaderboard display
├── lib/                   # Utility functions
│   ├── local-leaderboard.ts  # Leaderboard management
│   └── words.ts           # Word generation
├── types/                 # TypeScript type definitions
│   └── index.ts
└── package.json
```

## Color Scheme

- Background: `#0a1e1e` (Deep teal-black)
- Main/Primary: `#14b8a6` (Teal)
- Secondary: `#2dd4bf` (Light teal)
- Text: `#d1fae5` (Light mint)
- Error: `#ef4444` (Red)

## Features in Detail

### Typing Test
- Real-time character validation with color feedback
- Animated caret following your progress
- Dynamic word generation from 200+ common English words
- Automatic test completion based on selected mode

### Results Screen
- Comprehensive statistics including WPM, accuracy, consistency
- Character breakdown (correct/incorrect/total)
- Test duration and mode information
- Option to save results with custom username

### Leaderboard
- Top 10 scores for each mode/duration combination
- Filtering by mode, duration, and language
- Personal best tracking
- Rank calculation
- Export/import functionality

## Development

Built with inspiration from the original Monkeytype project, redesigned as UnixType with a professional teal color scheme and simplified architecture.

## License

GPL-3.0

---

Engineered by the UnixType Team
