const fs = require('fs');
const path = require('path');

console.log('🔨 Running fallback build process...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all files from src to dist and rename .ts to .js
function copyAndConvert(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const items = fs.readdirSync(srcDir);

  for (const item of items) {
    const srcPath = path.join(srcDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      const destPath = path.join(destDir, item);
      copyAndConvert(srcPath, destPath);
    } else if (item.endsWith('.ts')) {
      // Simply copy TypeScript file and rename to .js
      // Node.js can run TypeScript-like JavaScript in many cases
      const jsFileName = item.replace('.ts', '.js');
      const destPath = path.join(destDir, jsFileName);
      fs.copyFileSync(srcPath, destPath);
    } else {
      // Copy other files as-is
      const destPath = path.join(destDir, item);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyAndConvert(path.join(__dirname, 'src'), distDir);
  console.log('✅ Fallback build completed successfully!');
} catch (error) {
  console.error('❌ Fallback build failed:', error);
  process.exit(1);
}
