import pool, { testConnection } from './pool.js';

const migrations = [
  `CREATE TABLE IF NOT EXISTS audits (
    id VARCHAR(36) PRIMARY KEY,
    team_size INT NOT NULL DEFAULT 1,
    use_case VARCHAR(50) NOT NULL DEFAULT 'mixed',
    tools_input JSON NOT NULL,
    findings JSON NOT NULL,
    total_monthly_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_annual_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
    summary TEXT,
    ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(255),
    audit_id VARCHAR(36),
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_audit_id (audit_id),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function migrate() {
  const ok = await testConnection();
  if (!ok) {
    console.error('Cannot connect to MySQL. Check your .env credentials.');
    process.exit(1);
  }

  console.log('Running migrations...');
  for (const sql of migrations) {
    try {
      await pool.execute(sql);
      console.log('Migration applied:', sql.split('\n')[0].slice(0, 60) + '...');
    } catch (err) {
      console.error('Migration failed:', err.message);
      process.exit(1);
    }
  }
  console.log('All migrations complete.');
  await pool.end();
}

migrate();
