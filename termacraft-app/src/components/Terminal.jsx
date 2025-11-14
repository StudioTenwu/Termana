import { useState, useEffect, useRef } from 'react';
import { FileSystem } from 'javascript-terminal';
import { getTheme } from '../styles/theme';
import '../styles/Terminal.css';
import catSprite from '../assets/cat_PLACEHOLDER.png';
import magnifyingGlass from '../assets/magnifying_glass_PLACEHOLDER.png';

const Terminal = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [input, setInput] = useState('');
  const [outputs, setOutputs] = useState([]);
  const [fileSystem, setFileSystem] = useState(() => {
    return FileSystem.create({
      '/README.txt': { content: 'Welcome to TermaCraft!\n\nThis is a fun terminal for learning basic commands.\n\nTry these commands:\n- ls (list files)\n- cat README.txt (read this file)\n- mkdir myfolder (create a folder)\n- cd myfolder (change directory)' },
      '/hello.txt': { content: 'Hello, young programmer!' },
      '/story.txt': { content: 'Once upon a time, in a land of code...\n\nThere was a terminal that made learning fun!\n\nThe End.' },
      '/home': {},
      '/home/projects': {}
    });
  });
  const [currentPath, setCurrentPath] = useState('/');

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [outputs]);

  const theme = getTheme(isDarkMode);

  const parseCommand = (commandStr) => {
    const parts = commandStr.trim().split(/\s+/);
    return {
      commandName: parts[0],
      args: parts.slice(1)
    };
  };

  const executeCommand = (commandStr) => {
    if (!commandStr.trim()) return;

    const { commandName, args } = parseCommand(commandStr);

    // Add command to outputs
    setOutputs(prev => [
      ...prev,
      {
        type: 'command',
        content: commandStr,
        prompt: `${currentPath} $`
      }
    ]);

    // Execute the command
    switch (commandName) {
      case 'ls':
        handleLs(args);
        break;
      case 'cat':
        handleCat(args);
        break;
      case 'mkdir':
        handleMkdir(args);
        break;
      case 'cd':
        handleCd(args);
        break;
      case 'clear':
        setOutputs([]);
        break;
      case 'help':
        setOutputs(prev => [
          ...prev,
          {
            type: 'text',
            content: 'Available commands:\n' +
              '  ls [dir]       - list files and directories\n' +
              '  cat <file>     - display file contents\n' +
              '  mkdir <dir>    - create a new directory\n' +
              '  cd <dir>       - change directory\n' +
              '  clear          - clear the terminal\n' +
              '  help           - show this help message'
          }
        ]);
        break;
      default:
        setOutputs(prev => [
          ...prev,
          {
            type: 'error',
            content: `Command not found: ${commandName}. Type 'help' for available commands.`
          }
        ]);
    }
  };

  const handleLs = (args) => {
    const path = args[0] || currentPath;
    try {
      const dirContent = fileSystem.list(path);
      const entries = Array.from(dirContent.keys());

      setOutputs(prev => [
        ...prev,
        {
          type: 'ls',
          entries: entries,
          content: entries.join('\n')
        }
      ]);
    } catch (err) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: `ls: cannot access '${path}': No such file or directory`
        }
      ]);
    }
  };

  const handleCat = (args) => {
    if (args.length === 0) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: 'cat: missing file operand'
        }
      ]);
      return;
    }

    const fileName = args.join(' ');
    try {
      const content = fileSystem.read(fileName);
      setOutputs(prev => [
        ...prev,
        {
          type: 'cat',
          content: content
        }
      ]);
    } catch (err) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: `cat: ${fileName}: No such file or directory`
        }
      ]);
    }
  };

  const handleMkdir = (args) => {
    if (args.length === 0) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: 'mkdir: missing operand'
        }
      ]);
      return;
    }

    const dirName = args.join(' ');
    try {
      const newFs = fileSystem.mkdir(dirName);
      setFileSystem(newFs);
    } catch (err) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: `mkdir: cannot create directory '${dirName}': File exists`
        }
      ]);
    }
  };

  const handleCd = (args) => {
    const targetPath = args[0] || '/';

    // Handle relative paths
    let newPath = targetPath;
    if (!targetPath.startsWith('/')) {
      newPath = currentPath === '/' ? `/${targetPath}` : `${currentPath}/${targetPath}`;
    }

    // Handle .. and .
    if (targetPath === '..') {
      const parts = currentPath.split('/').filter(p => p);
      parts.pop();
      newPath = '/' + parts.join('/');
      if (newPath === '') newPath = '/';
    } else if (targetPath === '.') {
      newPath = currentPath;
    }

    try {
      // Check if directory exists
      fileSystem.list(newPath);
      setCurrentPath(newPath);
    } catch (err) {
      setOutputs(prev => [
        ...prev,
        {
          type: 'error',
          content: `cd: ${targetPath}: No such file or directory`
        }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderOutput = (output, index) => {
    switch (output.type) {
      case 'command':
        return (
          <div key={index} className="command-line">
            <span className="command-prompt" style={{ color: theme.green }}>
              {output.prompt}
            </span>
            <span className="command-text">{output.content}</span>
          </div>
        );

      case 'cat':
        return (
          <div key={index} className="cat-animation">
            <div
              className="speech-bubble"
              style={{
                borderColor: theme.cyan,
                color: theme.foreground
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output.content}</pre>
            </div>
            <img src={catSprite} alt="Cat" className="cat-sprite" />
          </div>
        );

      case 'ls':
        return (
          <div key={index} className="ls-animation">
            <img src={magnifyingGlass} alt="Magnifying Glass" className="magnifying-glass" />
            <div className="ls-content">
              <pre style={{ margin: 0, color: theme.brightCyan }}>
                {output.content}
              </pre>
            </div>
          </div>
        );

      case 'error':
        return (
          <div key={index} className="output-line" style={{ color: theme.red }}>
            {output.content}
          </div>
        );

      default:
        return (
          <div key={index} className="output-line">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output.content}</pre>
          </div>
        );
    }
  };

  return (
    <div
      className="terminal-container"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground
      }}
    >
      <div
        className="terminal-header"
        style={{ borderColor: theme.brightBlack }}
      >
        <div className="terminal-title">TermaCraft - Learning Terminal</div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          style={{
            borderColor: theme.cyan,
            color: theme.cyan
          }}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <div className="terminal-output" ref={outputRef}>
        {outputs.length === 0 && (
          <div style={{ color: theme.comment, padding: '20px' }}>
            <p>Welcome to TermaCraft! 🚀</p>
            <p>Type 'help' to see available commands, or try 'cat README.txt' to get started!</p>
          </div>
        )}
        {outputs.map((output, index) => renderOutput(output, index))}
      </div>

      <div
        className="terminal-input-line"
        style={{ borderColor: theme.brightBlack }}
      >
        <span className="terminal-prompt" style={{ color: theme.green }}>
          {currentPath} $
        </span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;
