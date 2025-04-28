import { Hono } from "hono";
import { init } from "./start.services";
import postRoutes from "./services/create.post";

const app = new Hono();

/**
 * Initialize Kafka services.
 */
init().catch((error) => {
  console.error("Initialization failed:", error);
  process.exit(1);
});

/**
 * Mount post creation routes.
 */
app.route("/", postRoutes);

/**
 * Health check endpoint.
 */
app.get("/", (c) => c.text("Post Producer Service is running"));

export default app;