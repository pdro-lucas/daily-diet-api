import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkIfSessionIdExists } from '../middlewares/check-session-id-exists';
import { randomUUID } from 'node:crypto';

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (request, reply) => {
      const createUserSchema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.coerce.string().min(8),
      });

      const { name, email, password } = createUserSchema.parse(request.body);

      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await knex('users').insert(
        {
          id: randomUUID(),
          name,
          email,
          password: hashedPassword,
        },
        ['id', 'name', 'email', 'created_at'],
      );

      return reply.status(201).send(response[0]);
    },
  );

  app.get(
    '/',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const response = await knex('users').select(
        'id',
        'name',
        'email',
        'created_at',
      );

      return reply.status(200).send(response);
    },
  );

  app.get(
    '/:id',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(request.params);

      const response = await knex('users')
        .select('id', 'name', 'email', 'created_at')
        .where({ id });

      if (response.length === 0) {
        return reply.status(404).send({ message: 'User not found' });
      }

      return reply.status(200).send(response[0]);
    },
  );

  app.delete(
    '/:id',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({
        id: z.string(),
      });

      const { id } = paramsSchema.parse(request.params);

      const response = await knex('users').where({ id }).delete();

      if (response === 0) {
        return reply.status(404).send({ message: 'User not found' });
      }

      await knex('sessions').where({ user_id: id }).delete();

      return reply.status(204).send();
    },
  );
}
