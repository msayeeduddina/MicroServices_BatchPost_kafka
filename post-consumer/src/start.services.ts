import { connectDB } from "./config/db.config";
import KafkaConfig from "./config/kafka.config";
import { postConsumer } from "./services/post.consumer";

/**
 * Initializes MongoDB, Kafka, and the post consumer service.
 * @throws {Error} If initialization fails.
 */
export const init = async (): Promise<void> => {
  try {
    await connectDB();
    await KafkaConfig.connect();
    await postConsumer();
    console.log("All services initialized successfully");
  } catch (error) {
    console.error("Service initialization error:", error);
    throw error;
  }
};