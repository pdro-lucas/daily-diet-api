// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      password: string;
      created_at: Date;
    };

    meals: {
      id: string;
      name: string;
      description: string;
      created_at: Date;
      in_diet: boolean;
      user_id: string;
    };

    sessions: {
      id: string;
      token: string;
      user_id: string;
      created_at: Date;
    };
  }
}
