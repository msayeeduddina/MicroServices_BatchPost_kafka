# Post Producer Microservice

## Overview
The `post-producer` microservice is part of an event-driven architecture (EDA) system built with TypeScript and Kafka. It provides an HTTP API to create posts, which are published as events to a Kafka topic (`posts`). The service uses the Hono framework for the API, KafkaJS for Kafka integration, and Zod for request validation, all running on the Bun JavaScript runtime.

This microservice works in tandem with the `post-consumer` microservice, which consumes and persists post events to a MongoDB database.

## Features
- **HTTP API**: Exposes a `POST /createPost` endpoint to create posts with `title` and `content`.
- **Kafka Integration**: Publishes post creation events to the `posts` Kafka topic.
- **Input Validation**: Uses Zod to validate incoming requests.
- **Error Handling**: Robust error handling and logging for Kafka and HTTP operations.
- **Type Safety**: Written in TypeScript, natively supported by Bun.

## Prerequisites
- **Bun**: Version 1.x or higher (install via `curl -fsSL https://bun.sh/install | bash`).
- **Kafka**: A running Kafka broker (e.g., `AAA.BBB.C.D:EEEE` or as specified in `.env`).
- **Docker** (optional): For running Kafka locally.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone
   cd Microservices_EDA/post-producer
   ```

2. **Install Dependencies**:
   Use Bun’s package manager:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `post-producer` directory:
   ```env
   KAFKA_BROKERS=XXXXX
   KAFKA_ZOOKEEPER_CONNECT=
   KAFKA_ADVERTISED_LISTENERS=
   ```
   Replace `XXXXX` with your Kafka broker address if different.

4. **Run Kafka** (if not already running):
   Use Docker to spin up a Kafka instance:
   ```bash
   docker run -p 2181:2181 zookeeper
   docker-compose -f docker-compose.kafka.yml up -d
   ```
   Ensure `docker-compose.kafka.yml` is configured with Kafka and Zookeeper.

5. **Start the Service**:
   Run the service directly with Bun (no separate build step needed):
   ```bash
   bun src/index.ts
   ```
   The service will run on `http://localhost:3000`.

## Usage
### Create a Post
Send a `POST` request to `http://localhost:3000/createPost` with the following JSON payload:
```json
{
  "title": "My Post Title",
  "content": "This is the content of my post."
}
```

**Example using `curl`**:
```bash
curl -X POST http://localhost:3000/createPost \
-H "Content-Type: application/json" \
-d '{"title":"My Post Title","content":"This is the content of my post."}'
```

**Response** (on success):
```json
{
  "message": "Post published successfully"
}
```

**Status Codes**:
- `201`: Post created and published to Kafka.
- `400`: Invalid request payload (e.g., missing title or content).
- `500`: Server or Kafka error.

### Health Check
Check if the service is running:
```bash
curl http://localhost:3000/
```
**Response**:
```
Post Producer Service is running
```

## Project Structure
```
post-producer/
├── src/
│   ├── config/
│   │   └── kafka.config.ts      # Kafka client, producer, and admin setup
│   ├── services/
│   │   └── create.post.ts       # Hono route for post creation
│   ├── index.ts                 # Entry point and route mounting
│   ├── start.services.ts        # Service initialization (Kafka, topic creation)
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
```

## Dependencies
- **hono**: Lightweight web framework for the API.
- **kafkajs**: Kafka client for JavaScript.
- **zod**: Schema validation for request payloads.
- **axios**: For HTTP requests in testing scripts.
- **typescript**: For type safety (natively supported by Bun).

## Troubleshooting
- **Kafka Connection Issues**:
  - Verify the `KAFKA_BROKERS` environment variable.
  - Ensure Kafka is running and accessible.
- **Port Conflicts**:
  - Change the port in `index.ts` if `3000` is in use.
- **Validation Errors**:
  - Ensure the payload includes `title` and `content`.
- **Bun Compatibility**:
  - Ensure all dependencies are compatible with Bun (use `bun add` for installation).

## Notes
- The `post-producer` is designed to integrate with the `post-consumer` microservice, which consumes events from the `posts` topic.
- For production, consider adding monitoring and logging solutions.
- Use Bun’s hot-reloading for development: `bun --hot src/index.ts`.