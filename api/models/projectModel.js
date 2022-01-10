import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'New group' },
    shapes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shape' }],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Project = mongoose.model('Project', projectSchema);
export default Project;
