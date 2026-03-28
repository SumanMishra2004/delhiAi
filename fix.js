const fs = require('fs');
const code = fs.readFileSync('src/components/price-prediction-chart.tsx', 'utf8');

let newCode = code.replace(/const cycleAmplitude = basePredicted \* 0.07;/, 'const cycleAmplitude = basePredicted * 0.18;');
newCode = newCode.replace(/const noise = \(\(pseudoRandom - Math.floor\(pseudoRandom\)\) \* 2 - 1\) \* \(basePredicted \* 0.04\);/, 'const noise = ((pseudoRandom - Math.floor(pseudoRandom)) * 2 - 1) * (basePredicted * 0.06);');

newCode = newCode.replace(/hsl\(var\(--chart-1\)\)/g, '#10b981');
newCode = newCode.replace(/hsl\(var\(--chart-2\)\)/g, '#8b5cf6');

fs.writeFileSync('src/components/price-prediction-chart.tsx', newCode);
console.log('Fixed chart styling and scale');
