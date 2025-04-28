import { Admin, Kafka, Producer, logLevel } from "kafkajs";

/**
 * Configuration and management of Kafka client, producer, and admin.
 */
class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private brokers: string;

  constructor(){
    this.brokers = process.env.KAFKA_BROKERS || "IPv4address";
    this.kafka = new Kafka({
      clientId: "post-producer",
      brokers: [this.brokers],
      logLevel: logLevel.ERROR,
      retry: { retries: 3 },
    });
    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
    });
    this.admin = this.kafka.admin();
  }

  /**
   * Connects the Kafka producer and admin.
   * @throws {Error} If connection fails.
   */
  async connect(): Promise<void> {
    try {
      await Promise.all([this.producer.connect(), this.admin.connect()]);
      console.log("Kafka producer and admin connected successfully");
    } catch (error) {
      console.error("Kafka connection error:", error);
      throw error;
    }
  }

  /**
   * Creates a Kafka topic with specified configuration.
   * @param topic - The Kafka topic to create.
   * @throws {Error} If topic creation fails.
   */
  async createTopic(topic: string): Promise<void> {
    try {
      const topicExists = await this.admin.listTopics();
      if (topicExists.includes(topic)) {
        console.log(`Topic ${topic} already exists`);
        return;
      }
      await this.admin.createTopics({
        topics: [
          {
            topic,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      console.log(`Topic ${topic} created successfully`);
    } catch (error) {
      console.error(`Error creating topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Sends a message to the specified Kafka topic.
   * @param topic - The Kafka topic to send the message to.
   * @param message - The message to send (stringified JSON).
   * @throws {Error} If message sending fails.
   */
  async sendTopic(topic: string, message: string): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      console.log(`Message sent to topic ${topic}: ${message}`);
    } catch (error) {
      console.error(`Error sending message to topic ${topic}:`, error);
      throw error;
    }
  }

  /**
   * Disconnects the Kafka producer and admin.
   * @throws {Error} If disconnection fails.
   */
  async disconnect(): Promise<void> {
    try {
      await Promise.all([this.producer.disconnect(), this.admin.disconnect()]);
      console.log("Kafka producer and admin disconnected successfully");
    } catch (error) {
      console.error("Kafka disconnection error:", error);
      throw error;
    }
  }
}

export default new KafkaConfig();