import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Shape from '../models/shapeModel.js';
import { isAuth } from '../utils.js';

const shapeRouter = express.Router();

shapeRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const shape = await Shape.findById(req.params.id);
    res.send(shape);
  })
);

shapeRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const shape = new Shape(req.body);
    await shape.save();
    res.send(shape);
  })
);

shapeRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let shape = await Shape.findById(req.params.id);
    if (!shape) {
      const newshape = new Shape(req.body.shape);
      shape = await newshape.save();
    }

    res.send(shape);
  })
);

//Find all shapes of user
shapeRouter.get(
  '/user/:userId',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const shapes = await Shape.find({ staff: req.params.userId })
      .populate({
        path: 'floor',
        model: 'Floor',
        populate: { path: 'building', model: 'Building' },
      })
      .populate('group')
      .populate('project')
      .populate('group');
    res.send(shapes);
  })
);

export default shapeRouter;
