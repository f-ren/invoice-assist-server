module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgres://ren:a@localhost/invoice-assist',
  JWT_SECRET: process.env.JWT_SECRET || 'bananas',
};
