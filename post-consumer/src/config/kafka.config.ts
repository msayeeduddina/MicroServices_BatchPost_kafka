import { Admin, Kafka, Consumer, logLevel } from "kafkajs";

/**
 * Configuration and management of Kafka client, consumer, and admin.
 */
class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private admin: Admin;
  private brokers: string;

  constructor() {
    this.brokers = process.env.KAFKA_BROKERS || "IPv4address";
    this.kafka = new Kafka({
      clientId: "post-consumer",
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
    });
    this.consumer = this.kafka.consumer({
      groupId: "post-consumer-group",
      retry: { retries: 3 },
    });
    this.admin = this.kafka.admin();
  }

  /**
   * Connects the Kafka consumer.
   * @throws {Error} If connection fails.
   */
  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log("Kafka consumer connected successfully");
    } catch (error) {
      console.error("Kafka connection error:", error);
      throw error;
    }
  }

  /**
   * Subscribes the consumer to a Kafka topic.
   * @param topic - The Kafka topic to subscribe to.
   * @throws {Error} If subscription fails.
   */
  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Error subscribing to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Consumes messages from the subscribed topic and processes them using the provided callback.
   * @param callback - Function to process each message.
   * @throws {Error} If message consumption fails.
   */
  async consumeMessages(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const messageValue = message?.value?.toString();
          if (!messageValue) {
            console.warn(`Empty message received on topic ${topic}, partition ${partition}`);
            return;
          }
          console.log(`Received message on topic ${topic}, partition ${partition}:`, messageValue);
          try {
            const parsedMessage = JSON.parse(messageValue);
            await callback(parsedMessage);
          } catch (parseError) {
            console.error(`Error parsing message on topic ${topic}:`, parseError);
          }
        },
      });
    } catch (error) {
      console.error("Error consuming Kafka messages:", error);
      throw error;
    }
  }

  /**
   * Disconnects the Kafka consumer.
   * @throws {Error} If disconnection fails.
   */
  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Kafka consumer disconnected successfully");
    } catch (error) {
      console.error("Kafka disconnection error:", error);
      throw error;
    }
  }
}

export default new KafkaConfig();