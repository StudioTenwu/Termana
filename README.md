# TermaCraft

> An educational terminal emulator for kids, featuring animated command execution and an interactive learning experience.

## Overview

TermaCraft is a browser-based terminal emulator designed to teach children the basics of command-line interaction in a fun, visual, and engaging way. Instead of intimidating text-only output, TermaCraft uses animations, themed styling, and an intelligent hint system to make learning terminal commands accessible and enjoyable.

## Features

### 🎨 Visual Learning
- **Animated Command Execution**: Each command triggers a unique animation to visualize what's happening
  - `ls` - Scanning square reveals hidden filenames
  - `cat` - Content appears in an animated box
  - `cd` - Visual path transitions
  - `mkdir` - Stacking blocks construct new directories

### 🌓 Theme Support
- Light and dark mode themes
- Color-coded output for better readability
- Customizable terminal appearance

### 💡 Intelligent Hint System
- Automatic hints appear after 10 seconds of inactivity
- Rotating helpful suggestions for next steps
- Non-intrusive UI that dismisses on interaction

### 📁 Simulated File System
- Full in-browser file system using `javascript-terminal`
- Persistent directory structure during session
- Pre-loaded sample files for exploration

## Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 5.4.2
- **File System**: javascript-terminal 1.1.1
- **Styling**: CSS3 with animations and keyframes
- **Development**: ESLint for code quality

## Project Structure

```
termacraft/
├── termacraft-app/           # Main application directory
│   ├── src/
│   │   ├── components/       # React components
│   │   │   └── Terminal.jsx  # Main terminal component
│   │   ├── styles/           # Styling files
│   │   │   ├── Terminal.css  # Terminal-specific styles
│   │   │   └── theme.js      # Theme definitions (dark/light)
│   │   ├── commands/         # Command handlers
│   │   │   └── customCommands.js
│   │   ├── assets/           # Static assets
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Dependencies and scripts
└── README.md                 # This file
```

## Installation

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd termacraft
   ```

2. Navigate to the app directory:
   ```bash
   cd termacraft-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to the displayed URL (default: `http://localhost:3000`)

## Available Commands

TermaCraft currently supports the following terminal commands:

### Navigation & Exploration
- **`ls [directory]`** - List files and directories
  - Example: `ls` or `ls /home`
  - Animation: Scanning square reveals filenames

- **`cd <directory>`** - Change current directory
  - Example: `cd home` or `cd ..`
  - Supports relative and absolute paths
  - Animation: Path transition effect

### File Operations
- **`cat <filename>`** - Display file contents
  - Example: `cat README.txt`
  - Animation: Content appears in animated box

- **`mkdir <directory>`** - Create a new directory
  - Example: `mkdir projects`
  - Animation: Stacking blocks build the folder

### Utility Commands
- **`help`** - Display available commands and usage
- **`clear`** - Clear the terminal screen

### Special Features
- **Path shortcuts**: Use `.` (current directory) and `..` (parent directory)
- **Tab completion**: Coming soon
- **Command history**: Coming soon

## Pre-loaded File System

The terminal comes with a sample file system to explore:

```
/
├── README.txt          # Welcome message and getting started guide
├── hello.txt           # Simple greeting file
├── story.txt           # Sample story for cat command practice
├── home/               # Home directory
│   └── projects/       # Sample subdirectory
```

## Development

### Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build
- **`npm run lint`** - Run ESLint to check code quality

### Architecture

#### Component Hierarchy
```
App
└── Terminal
    ├── Terminal Header (title + theme toggle)
    ├── Terminal Output (command history + animations)
    ├── Terminal Input (command prompt + input field)
    └── Hint System (appears on inactivity)
```

#### State Management
- File system state managed via `javascript-terminal` library
- Terminal state includes:
  - Current working directory path
  - Command output history
  - Input buffer
  - Theme preference (dark/light)
  - Hint system state (last command time, current hint)

#### Animation System
Animations are CSS-based for performance:
- **Keyframe animations** for smooth transitions
- **Staggered delays** for sequential reveals
- **Transform-based** movements (GPU accelerated)
- All animations complete in < 1 second for snappy feel

### Theme System

Themes are defined in `src/styles/theme.js` and include:

**Dark Mode** (default):
- Background: `#1e1e1e`
- Foreground: `#d4d4d4`
- Accent colors: cyan, green, yellow, red, purple

**Light Mode**:
- Background: `#ffffff`
- Foreground: `#333333`
- Adjusted accent colors for readability

Toggle themes using the button in the terminal header.

## Customization

### Adding New Commands

1. Open `src/components/Terminal.jsx`
2. Add a handler function following the pattern:
   ```javascript
   const handleNewCommand = (args) => {
     // Command logic here
     setOutputs(prev => [
       ...prev,
       { type: 'output', content: 'Command result' }
     ]);
   };
   ```
3. Add the command to the switch statement in `executeCommand()`
4. Update the help text

### Creating Custom Animations

1. Define a new output type in `renderOutput()`
2. Add corresponding CSS classes in `Terminal.css`
3. Create keyframe animations for the effect
4. Trigger the animation by setting the correct output type

## Educational Use

TermaCraft is designed for:
- **Ages 8-14**: Introduction to command-line concepts
- **Computer literacy classes**: Teaching file system navigation
- **Self-directed learning**: Interactive exploration with hints
- **Coding bootcamp prep**: Familiarization with terminal basics

### Learning Path

Suggested progression for new users:
1. Type `help` to see available commands
2. Try `cat README.txt` to read the welcome message
3. Use `ls` to explore the file system
4. Practice navigation with `cd` commands
5. Create your own directories with `mkdir`
6. Experiment and explore!

## Current Development Status

### ✅ Completed Features
- Basic terminal emulation
- Core commands (ls, cat, cd, mkdir, help, clear)
- Dark/light theme support
- Simulated file system
- Command parsing and execution

### 🚧 In Progress
- Square-based animation system (replacing placeholder images)
- Enhanced hint system with rotation
- Performance optimizations

### 📋 Planned Features
- Command history with up/down arrows
- Tab completion for files and commands
- More commands (pwd, touch, rm, cp, mv)
- Achievement system for learning milestones
- Save/load file system state
- Multi-user profiles
- Customizable themes
- Sound effects (optional)
- Tutorial mode with guided lessons

## Browser Compatibility

TermaCraft works best in modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## Contributing

Contributions are welcome! Areas where help is needed:
- Additional command implementations
- Animation improvements
- Educational content (sample files, tutorials)
- Accessibility enhancements
- Localization/translations
- Bug fixes and optimizations

## Performance Notes

- All animations are CSS-based for optimal performance
- File system operations are in-memory only
- No external API calls or network requests
- Minimal bundle size (~150KB gzipped)
- Runs smoothly on low-end devices

## License

[License information to be added]

## Acknowledgments

- Built with [React](https://react.dev/)
- File system powered by [javascript-terminal](https://github.com/nitin42/javascript-terminal)
- Build tooling by [Vite](https://vitejs.dev/)

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**TermaCraft** - Making terminal learning fun, one command at a time! 🚀
