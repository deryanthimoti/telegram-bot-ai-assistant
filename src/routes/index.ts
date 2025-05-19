import { FastifyInstance } from 'fastify';
import { getAllCoinGeckoData } from '../services/coinGecko';

export async function registerRoutes(fastify: FastifyInstance) {
  fastify.get('/hello', async (request, reply) => {
    return { message: 'Hello from Fastify with TypeScript!' };
  });

  fastify.get('/coins/list', async (request, reply) => {
    const data = await getAllCoinGeckoData();
    return data;
  });
}