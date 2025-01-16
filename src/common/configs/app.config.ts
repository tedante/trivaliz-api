import * as dotenv from 'dotenv';
dotenv.config();

// Sentry
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const SENTRY_API_KEY = process.env.SENTRY_API_KEY;
