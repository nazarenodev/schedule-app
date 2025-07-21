import { config } from 'dotenv';
import { execSync } from 'child_process';

// Load environment variables from .env.test
config({ path: '.env.test' });

// Run Prisma migrations to set up the test database schema
execSync('npx prisma migrate deploy');