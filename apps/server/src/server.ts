import app from './app.js';
import dotenv from 'dotenv';
import findConfig from 'find-config';
import ENV from './config/env.js';

const envPath = findConfig('.env') ?? findConfig('.env.example');
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

app.use((req, res) => {
  res.status(404).json({
    message: 'Route is not valid!',
    status: false,
  });
});

app.listen(Number(ENV.PORT), () => {
  console.log({
    message: 'server is running !',
    tech: 'express js ',
    port: ENV.PORT,
  });
});