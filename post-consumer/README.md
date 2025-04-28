# Post Consumer Microservice

## Overview
The `post-consumer` microservice is part of an event-driven architecture (EDA) system built with TypeScript and Kafka. It consumes post creation events from a Kafka topic (`posts`) and persists them to a MongoDB database. The service uses the Hono framework for a health check API, KafkaJS for Kafka integration, and Mongoose for MongoDB operations, all running on the Bun JavaScript runtime.

This microservice works in tandem with the `post-producer` microservice, which publishes post events to the `posts` topic.

## Features
- **Kafka Consumer**: Subscribes to the `posts` topic and processes messages in batches.
- **MongoDB Persistence**: Stores posts in a MongoDB database using Mongoose.
- **HTTP Health Check**: Exposes a `GET /` endpoint to verify service status.
- **Error Handling**: Robust error handling and logging for Kafka and MongoDB operations.
- **Type Safety**: Written in TypeScript, natively supported by Bun.

## Prerequisites
- **Bun**: Version 1.x or higher (install via `curl -fsSL https://bun.sh/install | bash`).
- **Kafka**: A running Kafka broker (e.g., `AAA.BBB.C.D:EEEE` or as specified in `.env`).
- **MongoDB**: A running MongoDB instance (e.g., `mongodb://localhost:27017/edaTest` or as specified in `.env`).
- **Docker** (optional): For running Kafka and MongoDB locally.

## Setup
1. **Clone the Repository**:
   ```bash
   git clone
   cd Microservices_EDA/post-consumer
   ```

2. **Install Dependencies**:
   Use Bun’s package manager:
   ```bash
   bun install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `post-consumer` directory:
   ```env
   KAFKA_BROKERS=XXXXX
   MONGO_URL=mongodb://localhost:27017/edaTest
   ```
   Replace `XXXXX` and `mongodb://localhost:27017/edaTest` with your Kafka and MongoDB addresses if different.

4. **Run Kafka and MongoDB** (if not already running):
   Use Docker to spin up Kafka and MongoDB:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```
   Ensure `docker-compose.yml` is configured with Kafka, Zookeeper, and MongoDB.

5. **Start the Service**:
   Run the service directly with Bun:
   ```bash
   bun src/index.ts
   ```
   The service will run on `http://localhost:3001`.

## Usage
### Health Check
Check if the service is running:
```bash
curl http://localhost:3001/
```
**Response**:
```
Post Consumer Service is running
```

### Consuming Posts
The service automatically subscribes to the `posts` Kafka topic and persists messages to MongoDB. To generate events:
1. Start the `post-producer` service.
2. Send a `POST` request to the `post-producer`’s `http://localhost:3000/createPost` endpoint (see `post-producer` README).
3. The `post-consumer` will consume and store the posts in MongoDB.

**MongoDB Verification**:
Connect to MongoDB and check the `posts` collection:
```bash
mongosh mongodb://localhost:27017/edaTest
> db.posts.find()
```

## Project Structure
```
post-consumer/
├── src/
│   ├── config/
│   │   ├── db.config.ts         # MongoDB connection setup
│   │   └── kafka.config.ts      # Kafka client and consumer setup
│   ├── model/
│   │   └── post.ts              # Mongoose schema for posts
│   ├── services/
│   │   └── post.consumer.ts     # Kafka consumer logic
│   ├── index.ts                 # Entry point and health check
│   ├── start.services.ts        # Service initialization (Kafka, MongoDB)
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
```

## Testing
 **Manual Testing**:
   - Send posts via the `post-producer` and verify they appear in MongoDB.
   - Check logs for Kafka consumption and MongoDB insertion.

## Dependencies
- **hono**: Lightweight web framework for the health check.
- **kafkajs**: Kafka client for JavaScript.
- **mongoose**: MongoDB ORM for data persistence.
- **typescript**: For type safety (natively supported by Bun).

## Troubleshooting
- **Kafka Connection Issues**:
  - Verify the `KAFKA_BROKERS` environment variable.
  - Ensure Kafka is running and accessible.
- **MongoDB Connection Issues**:
  - Verify the `MONGO_URL` environment variable.
  - Ensure MongoDB is running.
- **Port Conflicts**:
  - Change the port in `index.ts` if `3001` is in use.
- **Bun Compatibility**:
  - Ensure all dependencies are compatible with Bun (use `bun add` for installation).

## Notes
- The `post-consumer` is designed to integrate with the `post-producer` microservice, which publishes events to the `posts` topic.
- For production, consider adding monitoring and logging solutions.
- Use Bun’s hot-reloading for development: `bun --hot src/index.ts`.