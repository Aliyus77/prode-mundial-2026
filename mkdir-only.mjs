import fs from 'fs';
import path from 'path';

const baseDir = 'src';

// Create all directories
const dirs = [
  `${baseDir}/types`,
  `${baseDir}/services`,
  `${baseDir}/utils`,
  `${baseDir}/contexts`,
  `${baseDir}/hooks`,
  `${baseDir}/components`,
  `${baseDir}/components/common`,
  `${baseDir}/components/auth`,
  `${baseDir}/components/admin`,
  `${baseDir}/pages`
];

for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Created: ${dir}`);
}

console.log('\nAll directories created!');
console.log('Now run: node generate-files.mjs');
