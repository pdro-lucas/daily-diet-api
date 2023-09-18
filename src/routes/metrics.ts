import { FastifyInstance } from 'fastify';
import { checkIfSessionIdExists } from '../middlewares/check-session-id-exists';
import { knex } from '../database';

export async function MetricsRoute(app: FastifyInstance) {
  app.get(
    '/total-meals',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const totalMeals = await knex('meals')
        .where({ user_id: userId })
        .count('* as totalMeals')
        .first();

      return reply.status(200).send(totalMeals);
    },
  );

  app.get(
    '/diet-meals',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const inDietMeals = await knex('meals')
        .where({ user_id: userId, in_diet: true })
        .count('* as inDietMeals')
        .first();

      return reply.status(200).send(inDietMeals);
    },
  );

  app.get(
    '/non-diet-meals',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const nonDietMeals = await knex('meals')
        .where({ user_id: userId, in_diet: false })
        .count('* as nonDietMeals')
        .first();

      return reply.status(200).send(nonDietMeals);
    },
  );

  app.get(
    '/best-diet-sequence',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const userId = request.cookies.sessionId;

      const meals = await knex('meals').where({ user_id: userId }).select('*');

      const maxDietMealsPerDay = 3;

      let longesDietSequence = 0;
      let currentDietSequence = 0;

      for (let i = 0; i < meals.length; i++) {
        if (meals[i].in_diet) {
          currentDietSequence++;
        } else {
          if (currentDietSequence > longesDietSequence) {
            longesDietSequence = currentDietSequence;
          }
          currentDietSequence = 0;
        }
      }

      if (currentDietSequence > longesDietSequence) {
        longesDietSequence = currentDietSequence;
      }

      const bestDietSequence = Math.floor(
        longesDietSequence / maxDietMealsPerDay,
      );

      return reply.status(200).send({ bestDietSequence });
    },
  );
}
