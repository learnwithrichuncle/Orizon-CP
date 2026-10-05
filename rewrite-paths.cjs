const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);

let count = 0;

for (const file of files) {
  if (/\.(png|ico|woff|woff2|eot|ttf|jpg|jpeg|svg)$/i.test(file)) continue;
  
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace exact path strings for configs, Dockerfile, scripts, etc.
  content = content.replace(/src\/client/g, 'src/frontend');
  content = content.replace(/src\/server/g, 'src/backend');
  content = content.replace(/src\/shared/g, 'src/core');
  content = content.replace(/dist\/client/g, 'dist/frontend');
  content = content.replace(/dist\/server/g, 'dist/backend');
  content = content.replace(/deployments-tests/g, 'orizon-tests');

  // 2. Replace relative imports between these folders
  // E.g., import ... from "../../shared/something" -> import ... from "../../core/something"
  content = content.replace(/(from\s+['"]|import\(['"])((?:\.\.\/)+|\.\/)client(?=\/|['"])/g, '$1$2frontend');
  content = content.replace(/(from\s+['"]|import\(['"])((?:\.\.\/)+|\.\/)server(?=\/|['"])/g, '$1$2backend');
  content = content.replace(/(from\s+['"]|import\(['"])((?:\.\.\/)+|\.\/)shared(?=\/|['"])/g, '$1$2core');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
}

console.log(`Updated ${count} files with new paths.`);
