import { OutputFactory, Outputs } from 'javascript-terminal';

// Custom cat command that returns special format for animation
export const createCatCommand = () => {
  return {
    function: (state, opts) => {
      const fs = state.getFileSystem();
      const fileName = opts.join(' ');

      if (!fileName) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'cat',
            type: 'error',
            text: 'cat: missing file operand'
          })
        };
      }

      try {
        const fileContent = fs.read(fileName);

        // Return special format that our component will recognize
        return {
          output: OutputFactory.makeTextOutput(
            JSON.stringify({
              type: 'cat',
              content: fileContent
            })
          )
        };
      } catch (err) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'cat',
            type: 'error',
            text: `cat: ${fileName}: No such file or directory`
          })
        };
      }
    },
    optDef: {}
  };
};

// Custom ls command that returns special format for animation
export const createLsCommand = () => {
  return {
    function: (state, opts) => {
      const fs = state.getFileSystem();
      const path = opts[0] || '.';

      try {
        const dirContent = fs.list(path);
        const entries = Array.from(dirContent.keys());

        // Return special format that our component will recognize
        return {
          output: OutputFactory.makeTextOutput(
            JSON.stringify({
              type: 'ls',
              entries: entries,
              content: entries.join('\n')
            })
          )
        };
      } catch (err) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'ls',
            type: 'error',
            text: `ls: cannot access '${path}': No such file or directory`
          })
        };
      }
    },
    optDef: {}
  };
};

export const createMkdirCommand = () => {
  return {
    function: (state, opts) => {
      const fs = state.getFileSystem();
      const dirName = opts.join(' ');

      if (!dirName) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'mkdir',
            type: 'error',
            text: 'mkdir: missing operand'
          })
        };
      }

      try {
        const newFs = fs.mkdir(dirName);
        return {
          output: Outputs.EmptyOutput,
          state: state.setFileSystem(newFs)
        };
      } catch (err) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'mkdir',
            type: 'error',
            text: `mkdir: cannot create directory '${dirName}': File exists`
          })
        };
      }
    },
    optDef: {}
  };
};

export const createCdCommand = () => {
  return {
    function: (state, opts) => {
      const envVariables = state.getEnvVariables();
      const currentPath = envVariables.get('cwd') || '/';
      const targetPath = opts[0] || '/';

      const fs = state.getFileSystem();

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
      } else if (targetPath === '.') {
        newPath = currentPath;
      }

      try {
        // Check if directory exists
        fs.list(newPath);

        const newEnvVariables = envVariables.set('cwd', newPath);
        return {
          output: Outputs.EmptyOutput,
          state: state.setEnvVariables(newEnvVariables)
        };
      } catch (err) {
        return {
          output: OutputFactory.makeErrorOutput({
            source: 'cd',
            type: 'error',
            text: `cd: ${targetPath}: No such file or directory`
          })
        };
      }
    },
    optDef: {}
  };
};
