import mongoose from 'mongoose';

const shapeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    fill: { type: String },
    stroke: { type: String },
    color: { type: String },
    rotation: { type: Number },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    radius: { type: Number },
    radiusX: { type: Number },
    radiusY: { type: Number },
    numPoints: { type: Number },
    innerRadius: { type: Number },
    outerRadius: { type: Number },
    src: { type: String },
    isDeleted: { type: Boolean, default: false },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    monitor: { type: String },
    computer: { type: String },
    peripheral: { type: String },
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  },
  {
    timestamps: true,
  }
);

const Shape = mongoose.model('Shape', shapeSchema);
export default Shape;
