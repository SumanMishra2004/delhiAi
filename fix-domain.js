const fs = require('fs');
const code = fs.readFileSync('src/components/price-prediction-chart.tsx', 'utf8');

const regexStr = /<YAxis[\s\S]*?width=\{80\}\s*\/>/;
const newStr = "<YAxis tickFormatter={formatYAxis} axisLine={false} tickLine={false} tickMargin={8} width={80} domain={['dataMin - 50000', 'dataMax + 100000']} />";
const patched = code.replace(regexStr, newStr);

fs.writeFileSync('src/components/price-prediction-chart.tsx', patched);
console.log('Fixed YAxis domain');
