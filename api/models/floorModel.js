import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New floor' },
    shapes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shape' }],
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: { type: String, required: true, default: 'user' },
      },
    ],
    building: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Floor = mongoose.model('Floor', floorSchema);

export default Floor;
