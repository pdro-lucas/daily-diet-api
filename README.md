# Registro de Refeições na Dieta

Esta é uma aplicação de registro de refeições que permite aos usuários rastrear e otimizar suas escolhas alimentares dentro de uma dieta.

## Visão Geral

Esta aplicação foi desenvolvida como parte do desafio do Ignite e oferece as seguintes funcionalidades:

- Registro de refeições, incluindo nome, descrição e se a refeição está dentro da dieta.
- Visualização de métricas de alimentação, incluindo:
  - Quantidade total de refeições registradas.
  - Quantidade total de refeições dentro da dieta.
  - Quantidade total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

## Tecnologias Utilizadas

Esta aplicação foi desenvolvida utilizando as seguintes tecnologias e frameworks:

- [Node.js](https://nodejs.org/): Ambiente de execução JavaScript no servidor.
- [Fastify](https://www.fastify.io/): Framework web para Node.js.
- [Knex.js](http://knexjs.org/): Construtor de consultas SQL para Node.js.
- [Sqlite3](https://www.sqlite.org/index.html): Banco de dados utilizado para armazenar as refeições e métricas.

## Instalação

Siga estas etapas para instalar e configurar a aplicação em sua máquina local:

1. Clone este repositório.
2. Execute `npm install` para instalar as dependências.
3. Configure as variáveis de ambiente.
4. Execute `npm run knex migrate:latest` para executar as migrações do banco de dados.
5. Execute `npm run build` para compilar a aplicação.
6. Execute `npm start` para iniciar o servidor.

## Uso

- Registre suas refeições utilizando a API.
- Consulte as métricas de alimentação para obter informações sobre suas escolhas alimentares.
- Personalize sua dieta com base nas métricas fornecidas.

Para começar a utilizar a aplicação, será necessário utilizar o usuário padrão para realizar o login:

- E-mail: `admin@example.com`
- Senha: `admin123`

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin123@example.com",
  "senha": "admin123"
}
```

## API

A API da aplicação oferece os seguintes endpoints:

### Autenticação

- `POST /auth/login`: Realiza o login do usuário.
- `POST /auth/logout`: Realiza o logout do usuário.
- `POST /users`: Cria um novo usuário.
- `GET /users`: Retorna uma lista de usuários.
- `GET /users/:id`: Retorna os dados de um usuário.
- `PUT /users/:id`: Atualiza os dados de um usuário.
- `DELETE /users/:id`: Exclui um usuário.
- `POST /meals`: Registra uma nova refeição para o usuário atual.
- `GET /meals`: Retorna uma lista de refeições do usuário atual.
- `GET /meals/:id`: Retorna os dados de uma refeição do usuário atual.
- `PUT /meals/:id`: Atualiza os dados de uma refeição do usuário atual.
- `DELETE /meals/:id`: Exclui uma refeição do usuário atual.
- `GET /metrics`: Retorna as métricas de alimentação do usuário atual.
- `GET /metrics/best-diet-sequence`: Retorna a melhor sequência de refeições dentro da dieta do usuário atual.
- `GET /metrics/total-meals`: Retorna a quantidade total de refeições registradas pelo usuário atual.
- `GET /metrics/diet-meals`: Retorna a quantidade total de refeições dentro da dieta registradas pelo usuário atual.
- `GET /metrics/non-diet-meals`: Retorna a quantidade total de refeições fora da dieta registradas pelo usuário atual.

Exemplo de API para registrar uma refeição:

```http
POST /meals
Content-Type: application/json

{
  "name": "Almoço Saudável",
  "description": "Salada, frango grelhado e arroz integral",
  "inDiet": true
}
```

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.
