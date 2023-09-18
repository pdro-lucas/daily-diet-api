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
}
