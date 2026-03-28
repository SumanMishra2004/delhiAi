const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:CalcuttaHacks1234@db.ruqoxgdezhogxnnpwlyl.supabase.co:6543/postgres?pgbouncer=true' });
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Connection error:', err);
  else console.log('Connected natively to Postgres!', res.rows);
  pool.end();
});
