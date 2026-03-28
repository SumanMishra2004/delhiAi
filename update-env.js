const fs = require('fs');
let env = fs.readFileSync('.env', 'utf8');
env = env.replace(
  'DATABASE_URL="postgresql://postgres:CalcuttaHacks1234@db.ruqoxgdezhogxnnpwlyl.supabase.co:5432/postgres"',
  'DATABASE_URL="postgresql://postgres:CalcuttaHacks1234@db.ruqoxgdezhogxnnpwlyl.supabase.co:6543/postgres?pgbouncer=true"'
);
fs.writeFileSync('.env', env);
