import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ignoreDirs = ['node_modules', 'dist'];

// Match filenames
const ignorePatterns = [/\.d\.ts$/];

// Match commented-out code (not comments)
const singleLineCommentRegex = /\/\/.*[a-zA-Z0-9_$]+\s*=\s*.*|\/\/.*function\s+[a-zA-Z0-9_$]+\s*\(.*\)|\/\/.*if\s*\(.*\)|\/\/.*for\s*\(.*\)|\/\/.*while\s*\(.*\)/;
const multiLineCommentRegex = /\/\*[\s\S]*?\*\/.*[a-zA-Z0-9_$]+\s*=\s*.*|\/\*[\s\S]*?\*\/.*function\s+[a-zA-Z0-9_$]+\s*\(.*\)|\/\*[\s\S]*?\*\/.*if\s*\(.*\)|\/\*[\s\S]*?\*\/.*for\s*\(.*\)|\/\*[\s\S]*?\*\/.*while\s*\(.*\)/;

const shouldIgnoreFile = (fileName) => {
    return ignorePatterns.some(pattern => pattern.test(fileName));
};

const checkFileForComments = (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNumber = 0;

    rl.on('line', (line) => {
        lineNumber++;
        if (singleLineCommentRegex.test(line) || multiLineCommentRegex.test(line)) {
            console.log(`Commented-out code found in file: ${filePath}:${lineNumber}`);
            console.log(`Line: ${line.trim()}`);
        }
    });
};

const traverseDirectory = (dir) => {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${dir}`, err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory() && !ignoreDirs.includes(file.name)) {
                traverseDirectory(filePath);
            } else if (file.isFile() && !shouldIgnoreFile(file.name) && (file.name.endsWith('.js') || file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
                checkFileForComments(filePath);
            }
        });
    });
};

const rootDir = process.argv[2] || process.cwd();
traverseDirectory(rootDir);
