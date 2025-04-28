import KafkaConfig from "./config/kafka.config";

/**
 * Initializes Kafka producer and creates the 'posts' topic.
 * @throws {Error} If initialization fails.
 */
export const init = async (): Promise<void> => {
  try {
    await KafkaConfig.connect();
    await KafkaConfig.createTopic("posts");
    console.log("Kafka services initialized successfully");
  } catch (error) {
    console.error("Kafka initialization error:", error);
    throw error;
  }
};