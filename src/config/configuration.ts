const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? defaultValue!;
};

export default () => ({
  port: parseInt(getEnv('PORT', '3000'), 10),
  database: {
    host: getEnv('DATABASE_HOST'),
    port: parseInt(getEnv('DATABASE_PORT', '5432'), 10),
    username: getEnv('DATABASE_USER'),
    password: getEnv('DATABASE_PASSWORD'),
    database: getEnv('DATABASE_NAME'),
  },
  jwt: {
    accessSecret: getEnv('JWT_ACCESS_SECRET'),
    accessExpiry: getEnv('JWT_ACCESS_EXPIRY', '15m'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
    refreshExpiry: getEnv('JWT_REFRESH_EXPIRY', '7d'),
  },
  redis: {
    host: getEnv('REDIS_HOST', 'localhost'),
    port: parseInt(getEnv('REDIS_PORT', '6379'), 10),
    ttl: parseInt(getEnv('REDIS_TTL', '3600'), 10),
  },
  rateLimit: {
    ttl: parseInt(getEnv('RATE_LIMIT_TTL', '60'), 10),
    limit: parseInt(getEnv('RATE_LIMIT', '100'), 10),
  },
});
