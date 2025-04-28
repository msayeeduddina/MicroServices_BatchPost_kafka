import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import KafkaConfig from "../config/kafka.config";

const app = new Hono();

/**
 * Schema for validating post creation requests.
 */
const postSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  content: z.string().min(1, "Content is required").trim(),
});

/**
 * POST /createPost
 * Creates a post and publishes it to the Kafka 'posts' topic.
 */
app.post(
  "/createPost",
  zValidator("json", postSchema),
  async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      const message = JSON.stringify({ title, content });
      await KafkaConfig.sendTopic("posts", message);
      return c.json({ message: "Post published successfully" }, 201);
    } catch (error) {
      console.error("Error publishing post:", error);
      return c.json({ message: "Failed to publish post" }, 500);
    }
  }
);

export default app;