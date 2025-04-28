import { Hono } from "hono";
import { init } from "./start.services";

const app = new Hono();

/**
 * Initialize database and Kafka services.
 */
init().catch((error) => {
  console.error("Initialization failed:", error);
  process.exit(1);
});

/**
 * Health check endpoint.
 */
app.get("/", (c) => c.text("Post Consumer Service is running"));

export default {
  port: 3001,
  fetch: app.fetch,
};