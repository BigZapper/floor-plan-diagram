import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Building from '../models/buildingModel.js';
import { isAdmin, isAuth } from '../utils.js';

const buildingRouter = express.Router();

buildingRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const building = new Building({
      title: req.body.title || 'New building',
      floors: [],
      users: [{ user: req.user._id }],
      admin: req.user._id,
    });
    const createdBuilding = await building.save();
    res.status(201).send(createdBuilding);
  })
);

buildingRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const building = await Building.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        floors: req.body.floors,
        users: req.body.users,
        admin: req.body.admin,
      },
    }).populate('users.user', 'username');
    const savedBuilding = await building.save();
    res.send(savedBuilding);
  })
);

//GET ALL BUILDING
buildingRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const buildings = await Building.find({
      'users.user': { $in: req.user._id },
    })
      .populate('users.user', 'username')
      .sort({ createdAt: -1 });
    res.send(buildings);
  })
);

// GET A BUILDING BY ID
buildingRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const buildings = await Building.findById(req.params.id).populate(
      'users.user',
      'username'
    );
    res.send(buildings);
  })
);

// DELETE A BUILDING
buildingRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Building.findByIdAndDelete(req.params.id);
    res.status(200);
  })
);

export default buildingRouter;
