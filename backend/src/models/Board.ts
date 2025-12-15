import mongoose, { Document, Schema } from 'mongoose';

// Interface for Board document
export interface IBoard extends Document {
  name: string;
  description?: string;
  columns: Array<{
    id: string;
    name: string;
    status: 'todo' | 'in-progress' | 'done';
  }>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Board Schema
const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, 'Board name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    columns: {
      type: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            required: true,
          },
        },
      ],
      default: [
        { id: '1', name: 'To Do', status: 'todo' },
        { id: '2', name: 'In Progress', status: 'in-progress' },
        { id: '3', name: 'Done', status: 'done' },
      ],
    },
    createdBy: {
      type: String,
      ref: 'User', // For future auth feature
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
boardSchema.index({ createdAt: -1 });

// Export the model
export const Board = mongoose.model<IBoard>('Board', boardSchema);
