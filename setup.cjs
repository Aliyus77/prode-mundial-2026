#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'src',
  'src/types',
  'src/services',
  'src/utils',
  'src/contexts',
  'src/hooks',
  'src/components',
  'src/components/common',
  'src/components/auth',
  'src/components/admin',
  'src/pages'
];

console.log('Creating directories...');
for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`✓ ${dir}`);
}

console.log('\n✅ All directories created successfully!');
console.log('Now run: node generate-files.mjs');
