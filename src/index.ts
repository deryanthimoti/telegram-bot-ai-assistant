import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

import './bot';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  return { message: 'Telegram bot is running.' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
