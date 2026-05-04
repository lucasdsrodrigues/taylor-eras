
const fs = require('fs');
const path = require('path');

function removeComments(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);
    const originalContent = content;

    if (ext === '.js' || ext === '.jsx') {
        content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
        content = content.replace(/(?<![A-Za-z]+:)\/\/.*$/gm, '');
    } else if (ext === '.css') {
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    if (content !== originalContent) {
        content = content.replace(/^\s*[\r\n]/gm, '\n').replace(/\n{3,}/g, '\n\n');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Cleaned: ' + filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (ext === '.js' || ext === '.jsx' || ext === '.css') {
                removeComments(fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'src'));
console.log('All done.');

