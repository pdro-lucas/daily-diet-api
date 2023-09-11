import fastify from 'fastify';

const app = fastify();

app.get('/', async (request, reply) => {
  return 'Hello World';
});

export default app;
