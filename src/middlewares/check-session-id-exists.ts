import { FastifyReply, FastifyRequest } from 'fastify';
import { knex } from '../database';

export async function checkIfSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const session = await knex('sessions').where({ token: sessionId }).first();

  if (!session) {
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
