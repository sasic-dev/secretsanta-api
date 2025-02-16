# Secret Santa Backend

This is the backend service for the Secret Santa game, built using **NestJS** and **PostgreSQL**. The API allows users to upload employee lists, assign Secret Santa pairings, and download the assignments.

## Features

- Upload employees via CSV
- Assign Secret Santa participants
- Export assigned Santa data as CSV
- Docker support for containerized deployment

## Prerequisites

- **Node.js** (>= 18.x)
- **Docker & Docker Compose** (for containerized setup)
- **PostgreSQL** (if running without Docker)

## Installation

### Running Locally

1. Clone the repository:
   ```sh
   git clone https://github.com/sasic-dev/secretsanta-api.git
   cd secretsanta-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the root directory and set the following values:
   ```env
      PORT=6060
      APP_NAME=SecretSantaApp
      DB_HOST=localhost
      DB_PORT=5432
      DB_USER=usename
      DB_PASSWORD=password
      DB_NAME=database_name
   ```
4. Run database migrations (if using Prisma or TypeORM):
   ```sh
   npm run migrate
   ```
5. Start the server:
   ```sh
   npm run start:dev
   ```

### Running with Docker

1. Ensure Docker and Docker Compose are installed.
2. Build and start the containers:
   ```sh
   docker-compose up --build
   ```
3. Run migrations:
   ```sh
   docker-compose exec santaapp_api npm run typeorm:migration:run
   ```
4. The backend should be running on `http://localhost:<PORT>`

## API Endpoints

- `POST /employees/import` - Upload employee list as CSV
- `POST /assignments/generate` - Generate Secret Santa assignments
- `GET /assignments/export` - Download assignments as CSV

## CORS Configuration

CORS is enabled in `main.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });
  await app.listen(process.env.PORT || 6060);
}
bootstrap();
```

## Database Management

### Empty a Table in PostgreSQL

To delete all records in the `employees` table:

1. Access the PostgreSQL database inside the Docker container:

   ```sh
   docker-compose exec santaapp_db psql -U ${DB_USER} -d ${DB_NAME}
   ```

2. To empty the `employees` table, execute the following command:

   ```sql
   TRUNCATE TABLE employees;
   ```

3. To reset auto-increment ID:

   ```sql
   TRUNCATE TABLE employees RESTART IDENTITY;
   ```

4. To delete all records in the `assignments` table:
   ```sql
   TRUNCATE TABLE assignments;
   ```
5. To get all records in the `employees` table, execute the following command:
   ```sql
   SELECT * FROM employees;
   ```
6. To get all records in the `assignments` table, execute the following command:
   ```sql
   SELECT * FROM assignments;
   ```

```

## Contributing
Feel free to fork and contribute! Open an issue for discussions.

## License
MIT

```
