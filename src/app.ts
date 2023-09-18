import fastify from 'fastify';
import { usersRoutes } from './routes/users';
import cookie from '@fastify/cookie';
import { LoginRoute } from './routes/auth';

const app = fastify();

app.register(cookie);
app.register(LoginRoute, { prefix: '/auth' });
app.register(usersRoutes, { prefix: '/users' });

export default app;
