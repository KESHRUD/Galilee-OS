import mongoose, { Document, Schema } from 'mongoose';

// Interface for Task document
export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  boardId?: mongoose.Types.ObjectId;
  tags?: string[];
  dueDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Task Schema
const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in-progress', 'done'],
        message: '{VALUE} is not a valid status',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
    tags: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ boardId: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ createdAt: -1 });

// Export the model
export const Task = mongoose.model<ITask>('Task', taskSchema);
