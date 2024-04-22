import 'dotenv/config';
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';

function setupDB() {
  const sqlite = new Database(process.env.DATABASE_URL);

  console.log('created db file');
  // rename to schema.sql
  const migrationFile = readFileSync('database/schema.sql', 'utf-8');

  console.log('running migration....');
  sqlite.exec(migrationFile);
  console.log('migration complete!');
  process.on('exit', () => sqlite.close());
  process.exit(0);
}

setupDB();