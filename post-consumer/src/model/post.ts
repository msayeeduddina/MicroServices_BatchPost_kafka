import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface for Post document.
 */
interface IPost extends Document {
  title: string;
  content: string;
}

/**
 * Mongoose schema for Post collection.
 */
const postSchema = new Schema<IPost>({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
});

/**
 * Mongoose model for Post collection.
 */
const PostModel = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default PostModel;