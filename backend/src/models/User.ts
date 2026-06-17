import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
  return await bcryptjs.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
