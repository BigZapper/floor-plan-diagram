import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New building' },
    floors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }],
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
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
const Building = mongoose.model('Building', buildingSchema);
export default Building;
