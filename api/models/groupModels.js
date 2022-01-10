import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New group' },
    shapes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shape' }],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.model('Group', groupSchema);
export default Group;
