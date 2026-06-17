import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  uploader: mongoose.Types.ObjectId;
  views: number;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVideo>('Video', videoSchema);
