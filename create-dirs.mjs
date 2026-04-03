import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create directories
const dirs = [
  'src/types',
  'src/services',
  'src/utils',
  'src/contexts',
  'src/hooks',
  'src/components/common',
  'src/components/auth',
  'src/components/admin',
  'src/pages'
];

for (const dir of dirs) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${dir}`);
  }
}

console.log('All directories created successfully!');
