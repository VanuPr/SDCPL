const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

// Regex patterns to match specific colored hexes that are not black/white/gray/orange
const colorReplacements = [
  // Purples
  { regex: /#6b21a8/gi, replacement: 'var(--primary-color)' },
  // Blues
  { regex: /#0ea5e9/gi, replacement: 'var(--primary-color)' },
  { regex: /#2563eb/gi, replacement: 'var(--primary-color)' },
  { regex: /#0284c7/gi, replacement: 'var(--primary-color)' },
  { regex: /#3b82f6/gi, replacement: 'var(--primary-color)' },
  // Greens
  { regex: /#10b981/gi, replacement: 'var(--primary-color)' },
  { regex: /#166534/gi, replacement: 'var(--primary-color)' }, // Success text
  { regex: /#dcfce7/gi, replacement: '#f8fafc' }, // Success bg -> light gray/white
  // Yellows
  { regex: /#fbbf24/gi, replacement: 'var(--primary-color)' },
  // Reds
  { regex: /#ef4444/gi, replacement: 'var(--primary-color)' },
  // WhatsApp Green (if any)
  { regex: /#25D366/gi, replacement: 'var(--primary-color)' },
  // Linear gradients with orange and red
  { regex: /linear-gradient\(135deg,\s*var\(--primary-color\),\s*#d94d1f\)/gi, replacement: 'var(--primary-color)' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css') || fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      for (const rule of colorReplacements) {
        if (rule.regex.test(content)) {
          content = content.replace(rule.regex, rule.replacement);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in: ${fullPath}`);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Color replacement complete.');
