import KafkaConfig from "../config/kafka.config";
import PostModel from "../model/post";

/**
 * Consumes messages from the 'posts' Kafka topic and saves them to MongoDB in batches.
 */
export const postConsumer = async (): Promise<void> => {
  const messages: any[] = [];
  let processing = false;
  const batchSize = 100;
  const batchInterval = 5000; // 5 seconds

  try {
    await KafkaConfig.subscribeTopic("posts");
    await KafkaConfig.consumeMessages(async (message: any) => {
      if (!message.title || !message.content) {
        console.warn("Invalid message received:", message);
        return;
      }
      messages.push(message);
      console.log("Buffered message:", message);

      // Immediate processing if batch size is reached
      if (messages.length >= batchSize) {
        await processMessages();
      }
    });

    // Periodic processing for remaining messages
    setInterval(processMessages, batchInterval);
  } catch (error) {
    console.error("Error in post consumer:", error);
    throw error;
  }

  /**
   * Processes batched messages by saving them to MongoDB.
   */
  async function processMessages(): Promise<void> {
    if (messages.length === 0 || processing) return;

    processing = true;
    const batchToProcess = [...messages];
    messages.length = 0;

    try {
      await PostModel.insertMany(batchToProcess, { ordered: false });
      console.log(`Successfully processed ${batchToProcess.length} messages`);
    } catch (error) {
      console.error("Error processing messages:", error);
      // Re-queue failed messages for retry
      messages.push(...batchToProcess);
    } finally {
      processing = false;
    }
  }
};