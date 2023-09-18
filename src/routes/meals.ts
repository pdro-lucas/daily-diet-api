import { FastifyInstance } from 'fastify';
import { checkIfSessionIdExists } from '../middlewares/check-session-id-exists';
import { z } from 'zod';
import { knex } from '../database';
import { randomUUID } from 'crypto';

export async function MealsRoute(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkIfSessionIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const createMealSchema = z.object({
        name: z.string().min(3),
        description: z.string(),
        inDiet: z.boolean().default(false),
      });

      const { name, description, inDiet } = createMealSchema.parse(
        request.body,
      );

      const response = await knex('meals').insert(
        {
          id: randomUUID(),
          name,
          description,
          in_diet: inDiet,
          user_id: userId,
        },
        ['id', 'name', 'description', 'in_diet', 'user_id', 'created_at'],
      );

      return reply.status(201).send(response[0]);
    },
  );

  app.get(
    '/',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const meals = await knex('meals').where({ user_id: userId });

      return reply.status(200).send(meals);
    },
  );

  app.get(
    '/:id',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const meal = await knex('meals').where({ id, user_id: userId }).first();

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      return reply.status(200).send(meal);
    },
  );

  app.put('/:id', async (request, reply) => {
    const userId = request.cookies.sessionId;
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const updateMealSchema = z.object({
      name: z.string().min(3).optional(),
      description: z.string().optional(),
      inDiet: z.boolean().default(false).optional(),
    });

    const { name, description, inDiet } = updateMealSchema.parse(request.body);

    const meal = await knex('meals').where({ id, user_id: userId }).first();

    if (!meal) {
      return reply.status(404).send({ message: 'Meal not found' });
    }

    const updateMeal = {
      name: name || meal.name,
      description: description || meal.description,
      in_diet: inDiet !== undefined ? inDiet : meal.in_diet,
    };

    const response = await knex('meals')
      .where({ id, user_id: userId })
      .update(updateMeal, [
        'id',
        'name',
        'description',
        'in_diet',
        'user_id',
        'created_at',
      ]);

    if (!response) {
      return reply.status(500).send({ message: 'Something went wrong' });
    }

    return reply.status(200).send(response[0]);
  });

  app.delete(
    '/:id',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;
      const paramsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = paramsSchema.parse(request.params);

      const meal = await knex('meals').where({ id, user_id: userId }).first();

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' });
      }

      const response = await knex('meals').where({ id, user_id: userId }).del();

      if (!response) {
        return reply.status(500).send({ message: 'Something went wrong' });
      }

      return reply.status(200).send({ message: 'Meal deleted' });
    },
  );
}
