import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';

export async function LoginRoute(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const userSchema = z.object({
      email: z.string().email(),
      password: z.coerce.string().min(8),
    });

    const { email, password } = userSchema.parse(request.body);

    const user = await knex('users').where({ email }).first();

    if (!user) {
      return reply.code(401).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const sessionId = randomUUID();

    const response = await knex('sessions').insert(
      {
        id: randomUUID(),
        token: sessionId,
        user_id: user.id,
      },
      ['id', 'token', 'user_id', 'created_at'],
    );

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    });

    return reply.status(201).send(response[0]);
  });

  app.post('/logout', async (request, reply) => {
    const sessionId = request.cookies.sessionId;

    if (!sessionId) {
      return reply.code(401).send({ message: 'Invalid session' });
    }

    await knex('sessions').where({ token: sessionId }).delete();

    reply.clearCookie('sessionId', {
      path: '/',
    });

    return reply.code(200).send({ message: 'Logout success' });
  });
}
