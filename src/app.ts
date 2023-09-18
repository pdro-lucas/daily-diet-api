import fastify from 'fastify';
import { usersRoutes } from './routes/users';
import cookie from '@fastify/cookie';
import { LoginRoute } from './routes/auth';
import { MealsRoute } from './routes/meals';
import { MetricsRoute } from './routes/metrics';

const app = fastify();

app.register(cookie);
app.register(LoginRoute, { prefix: '/auth' });
app.register(usersRoutes, { prefix: '/users' });
app.register(MealsRoute, { prefix: '/meals' });
app.register(MetricsRoute, { prefix: '/metrics' });

export default app;
